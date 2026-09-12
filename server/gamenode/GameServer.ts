import axios from 'axios';
import fs from 'fs';
import http from 'http';
import https from 'https';
import jwt from 'jsonwebtoken';
import * as socketio from 'socket.io';

import Game from '../game/Game.js';
import { cards as cardLibrary } from '../game/cards/index.js';
import type { GameRouter } from '../game/GameRouter.js';
import type Player from '../game/Player.js';
import { logger } from '../logger.js';
import Socket from '../Socket.js';
import { detectBinary } from '../util.js';
import { stringifyWithoutCycles, WsSocket } from './WsSocket.js';
import type { GameSummary, PendingGameDTO, ShortCardData, UserIdentity } from './LobbyProtocol.js';
import type { GameDetails } from '../game/Game.js';
import type { MenuItem } from '../game/MenuCommands.js';
import * as env from '../env.js';

const MAX_DEBUG_DATA_LENGTH = 4 * 1024 * 1024;

export class GameServer implements GameRouter {
    private games = new Map<string, Game>();
    private userGameMap = new Map<string, Game>();
    private abandonTimers = new Map<string, ReturnType<typeof setTimeout>>();
    private protocol = 'https';
    private host = env.domain;
    private wsSocket: WsSocket;
    private io: socketio.Server;
    private shortCardData: ShortCardData[] = [];
    private lastSentMessageCount = new Map<string, number>();

    constructor() {
        let privateKey: undefined | string;
        let certificate: undefined | string;
        try {
            privateKey = fs.readFileSync(env.gameNodeKeyPath as string).toString();
            certificate = fs.readFileSync(env.gameNodeCertPath as string).toString();
        } catch{
            // No local certs — if HTTPS is enabled (e.g. via nginx proxy), still
            // advertise https to clients so they connect over the proxy.
            this.protocol = env.https === 'true' ? 'https' : 'http';
        }

        this.wsSocket = new WsSocket(this.host, this.protocol);
        this.wsSocket.on('onStartGame', this.onStartGame.bind(this));
        this.wsSocket.on('onSpectator', this.onSpectator.bind(this));
        this.wsSocket.on('onGameSync', this.onGameSync.bind(this));
        this.wsSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.wsSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.wsSocket.on('onCardData', this.onCardData.bind(this));

        // HTTP request handler for health checks
        const requestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
            if(req.url === '/health') {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'ok',
                    timestamp: Date.now(),
                    games: this.games.size
                }));
            }
        };

        const server =
            !privateKey || !certificate
                ? http.createServer(requestHandler)
                : https.createServer({ key: privateKey, cert: certificate }, requestHandler);

        server.listen(env.gameNodeSocketIoPort, () => {
            logger.info(`${env.gameNodeName} listening on port ${env.gameNodeSocketIoPort} (proxy port ${env.gameNodeProxyPort ?? 'none'}, protocol ${this.protocol})`);
        });

        const lobbyOrigins = [`https://${env.domain}`, `http://${env.domain}`];
        if(env.lobbyPort && env.lobbyPort !== 80 && env.lobbyPort !== 443) {
            lobbyOrigins.push(`https://${env.domain}:${env.lobbyPort}`, `http://${env.domain}:${env.lobbyPort}`);
        }
        const corsConfig = env.domain
            ? { origin: lobbyOrigins, credentials: true }
            : { origin: true, credentials: true };

        this.io = new socketio.Server(server, {
            perMessageDeflate: false,
            path: `/${env.gameNodeName}/socket.io`,
            pingTimeout: 30000,
            pingInterval: 25000,
            cors: corsConfig
        });
        this.io.use(this.handshake.bind(this));
        this.io.on('connection', this.onConnection.bind(this));
    }

    public debugDump() {
        const games = [];
        for(const game of this.games.values()) {
            const players = [];
            for(const player of Object.values(game.playersAndSpectators)) {
                players.push({
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id,
                    spectator: game.isSpectator(player)
                });
            }
            games.push({
                name: game.name,
                players: players,
                id: game.id,
                started: game.started,
                startedAt: game.startedAt
            });
        }

        return {
            games: games,
            gameCount: this.games.size
        };
    }

    handleError(game: Game, e: Error) {
        logger.error(`Game error: ${e.message}\n${e.stack}`);

        const debugData: Record<string, unknown> = {};

        if(e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(game.getState());
        } else {
            debugData.pipeline = game.pipeline.getDebugInfo();
            debugData.effectEngine = game.effectEngine.getDebugInfo();
        }

        const playerNames = game.getPlayers().map((p) => p.name);
        if(playerNames.length >= 2) {
            this.wsSocket.send('GAMEERROR', {
                gameId: game.id,
                gameName: game.name,
                players: playerNames,
                errorMessage: e.message,
                errorStack: e.stack,
                timestamp: new Date().toISOString(),
                debugData: this.limitDebugData(debugData)
            });
        }

        if(game) {
            game.addMessage(
                'A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.'
            );
        }
    }

    // The report has to survive a WebSocket frame and then a Mongo document, so keep
    // the message and stack at any cost and drop the debug data if it will not fit.
    private limitDebugData(debugData: Record<string, unknown>): unknown {
        try {
            const length = stringifyWithoutCycles(debugData).length;
            if(length <= MAX_DEBUG_DATA_LENGTH) {
                return debugData;
            }
            return { omitted: `${length} characters, over the ${MAX_DEBUG_DATA_LENGTH} limit` };
        } catch(err) {
            return { omitted: `could not be serialized: ${err}` };
        }
    }

    runAndCatchErrors(game: Game, func: () => void) {
        try {
            func();
        } catch(e) {
            this.handleError(game, e as Error);

            this.sendGameState(game);
        }
    }

    findGameForUser(username: string): undefined | Game {
        return this.userGameMap.get(username);
    }

    private registerUsersForGame(game: Game): void {
        for(const username of Object.keys(game.playersAndSpectators)) {
            this.userGameMap.set(username, game);
        }
    }

    private unregisterUsersForGame(game: Game): void {
        for(const username of Object.keys(game.playersAndSpectators)) {
            if(this.userGameMap.get(username) === game) {
                this.userGameMap.delete(username);
            }
        }
    }

    sendGameState(game: Game): void {
        const sharedState = game.getSharedState();
        const allMessages = game.gameChat.messages;
        const totalMessages = allMessages.length;
        let spectatorState: ReturnType<Game['getState']> | null = null;

        // Record hidden info (hands + facedown provinces) for replay enrichment — only when changed
        if(game.started) {
            game.recordHiddenInfoIfChanged();
        }

        for(const player of Object.values(game.getPlayersAndSpectators())) {
            if(player.socket && !player.left && !player.disconnected) {
                let state: ReturnType<Game['getState']> | null;
                if(game.isSpectator(player)) {
                    // All spectators see the same game view — compute once
                    if(!spectatorState) {
                        spectatorState = game.getState(player.name, sharedState);
                    }
                    state = spectatorState;
                } else {
                    state = game.getState(player.name, sharedState);
                }

                // Send only new messages since last send
                const socketId = player.socket.id || player.name;
                const lastSent = this.lastSentMessageCount.get(socketId) || 0;
                const newMessages = lastSent === 0 ? allMessages : allMessages.slice(lastSent);
                this.lastSentMessageCount.set(socketId, totalMessages);

                // Replace full messages with just new ones, add flag for client
                const stateWithMessages = Object.assign({}, state, {
                    messages: newMessages,
                    newMessages: lastSent > 0
                });

                player.socket.send('gamestate', stateWithMessages);
            }
        }

        game.clearAnimations();
    }

    private clearMessageCountsForGame(game: Game): void {
        for(const player of Object.values(game.getPlayersAndSpectators())) {
            if(player.socket?.id) {
                this.lastSentMessageCount.delete(player.socket.id);
            }
            this.lastSentMessageCount.delete(player.name);
        }
    }

    notifyAndCloseGame(game: Game): void {
        for(const player of Object.values(game.getPlayersAndSpectators())) {
            if(player.socket && !player.disconnected) {
                player.socket.send('cleargamestate');
                player.socket.leaveChannel(game.id);
            }
        }
        this.clearMessageCountsForGame(game);
        this.unregisterUsersForGame(game);
        this.games.delete(game.id);
        this.wsSocket.send('GAMECLOSED', { game: game.id });
    }

    startAbandonTimer(game: Game): void {
        if(this.abandonTimers.has(game.id)) {
            return;
        }

        game.addAlert('info', 'Both players have left. This match will close in 60 seconds.');
        this.sendGameState(game);

        const timer = setTimeout(() => {
            this.abandonTimers.delete(game.id);
            if(this.games.has(game.id)) {
                logger.info(`Auto-closing abandoned game ${game.id} (${game.name})`);
                this.notifyAndCloseGame(game);
            }
        }, 60 * 1000);

        this.abandonTimers.set(game.id, timer);
    }

    cancelAbandonTimer(gameId: string): void {
        const timer = this.abandonTimers.get(gameId);
        if(timer) {
            clearTimeout(timer);
            this.abandonTimers.delete(gameId);
        }
    }

    handshake(socket: socketio.Socket, next: (err?: Error) => void) {
        const token = (socket.handshake.auth as Record<string, unknown>)?.token;
        if(token && token !== 'undefined') {
            jwt.verify(token as string, env.secret, { algorithms: ['HS256'] }, function (err, user) {
                if(err) {
                    logger.info(`JWT verification failed: ${err.message}`);
                    return next(new Error('Invalid authentication token'));
                }

                (socket.request as { user?: unknown }).user = user;
                next();
            });
        } else {
            next();
        }
    }

    gameWon(game: Game, reason: string, winner: Player): void {
        const saveState = game.getSaveState();
        this.wsSocket.send('GAMEWIN', { game: saveState, winner: winner.name, reason: reason });

        void axios
            .post(
                `https://l5r-analytics-engine-production.up.railway.app/api/game-report/${env.environment}`,
                saveState
            )
            .catch(() => {});

        // Send hidden info log (hands + provinces) to both players for replay enrichment
        const hiddenInfoLog = game.hiddenInfoLog;
        for(const player of game.getPlayers()) {
            if(player.socket && !player.disconnected) {
                player.socket.send('hiddeninfo', hiddenInfoLog);
            }
        }
    }

    onStartGame(pendingGame: PendingGameDTO): void {
        const playerNames = Object.values(pendingGame.players).map((p) => p.name).join(' vs ');
        logger.info(`Starting game ${pendingGame.id} (${playerNames}), total games: ${this.games.size + 1}`);
        const game = new Game(pendingGame as GameDetails, { router: this, shortCardData: this.shortCardData, cardLibrary });
        this.games.set(pendingGame.id, game);
        this.registerUsersForGame(game);

        game.started = true;
        for(const player of Object.values(pendingGame.players)) {
            game.selectDeck(player.name, player.deck);
        }

        game.initialise();
    }

    onSpectator(pendingGame: PendingGameDTO, user: UserIdentity) {
        const game = this.games.get(pendingGame.id);
        if(!game) {
            return;
        }

        game.watch('TBA', user);
        this.userGameMap.set(user.username, game);

        this.sendGameState(game);
    }

    onGameSync(callback: (summaries: GameSummary[]) => void) {
        const gameSummaries: GameSummary[] = [];
        for(const game of this.games.values()) {
            const retGame = game.getSummary();
            if(retGame) {
                retGame.password = game.password;
                gameSummaries.push(retGame);
            }
        }

        logger.info(`syncing ${gameSummaries.length} games`);

        callback(gameSummaries);
    }

    onFailedConnect(gameId: string, username: string) {
        const game = this.findGameForUser(username);
        if(!game || game.id !== gameId) {
            return;
        }

        game.failedConnect(username);
        this.userGameMap.delete(username);

        if(game.isEmpty()) {
            this.cancelAbandonTimer(game.id);
            this.clearMessageCountsForGame(game);
            this.unregisterUsersForGame(game);
            this.games.delete(game.id);
            this.wsSocket.send('GAMECLOSED', { game: game.id });
        } else if(game.allPlayersGone()) {
            this.startAbandonTimer(game);
        }

        this.sendGameState(game);
    }

    onCloseGame(gameId: string) {
        this.cancelAbandonTimer(gameId);
        const game = this.games.get(gameId);
        if(!game) {
            return;
        }

        logger.info(`Closed game ${gameId}, remaining games: ${this.games.size - 1}`);
        this.notifyAndCloseGame(game);
    }

    onCardData(cardData: { titleCardData: unknown; shortCardData: unknown }) {
        this.shortCardData = cardData.shortCardData as ShortCardData[];
    }

    onConnection(ioSocket: socketio.Socket) {
        const req = ioSocket.request as { user?: { username: string } };
        if(!req.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        const game = this.findGameForUser(req.user.username);
        if(!game) {
            logger.info(`No game for ${req.user.username}, disconnecting`);
            ioSocket.disconnect();
            return;
        }

        const socket = new Socket(ioSocket);
        if(!socket.user) {
            return;
        }

        const player = game.playersAndSpectators[socket.user.username];
        if(!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        if(player.disconnected) {
            logger.info('user \'%s\' reconnected to game', socket.user.username);
            game.reconnect(socket, player.name);

            if(!game.isSpectator(player) && this.abandonTimers.has(game.id)) {
                this.cancelAbandonTimer(game.id);
                game.addAlert('info', 'A player has reconnected. Auto-close cancelled.');
            }
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if(!game.isSpectator(player)) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket: Socket, reason: string) {
        if(!socket.user) {
            return;
        }
        const game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        logger.info('user \'%s\' disconnected from a game: %s', socket.user.username, reason);

        this.lastSentMessageCount.delete(socket.id);

        const isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.disconnect(socket.user.username);

        if(game.isEmpty()) {
            this.cancelAbandonTimer(game.id);
            this.clearMessageCountsForGame(game);
            this.unregisterUsersForGame(game);
            this.games.delete(game.id);

            this.wsSocket.send('GAMECLOSED', { game: game.id });
        } else if(!isSpectator && game.allPlayersGone()) {
            this.startAbandonTimer(game);
        } else if(isSpectator) {
            this.userGameMap.delete(socket.user.username);
            this.wsSocket.send('PLAYERLEFT', {
                gameId: game.id,
                game: game.getSaveState(),
                player: socket.user.username,
                spectator: true
            });
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket: Socket) {
        if(!socket.user) {
            return;
        }
        const game = this.findGameForUser(socket.user.username);
        if(!game) {
            return;
        }

        const isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.leave(socket.user.username);
        this.userGameMap.delete(socket.user.username);
        this.lastSentMessageCount.delete(socket.id);

        this.wsSocket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if(game.isEmpty()) {
            this.cancelAbandonTimer(game.id);
            this.clearMessageCountsForGame(game);
            this.unregisterUsersForGame(game);
            this.games.delete(game.id);

            this.wsSocket.send('GAMECLOSED', { game: game.id });
        } else if(!isSpectator && game.allPlayersGone()) {
            this.startAbandonTimer(game);
        }

        this.sendGameState(game);
    }

    private static readonly GAME_COMMANDS = {
        cardClicked: (g: Game, p: string, cardId: string) => g.cardClicked(p, cardId),
        changeStat: (g: Game, p: string, stat: string, value: number) => g.changeStat(p, stat, value),
        chat: (g: Game, p: string, message: string) => g.chat(p, message),
        concede: (g: Game, p: string) => g.concede(p),
        drop: (g: Game, p: string, cardId: string, source: string, target: string) => g.drop(p, cardId, source, target),
        facedownCardClicked: (g: Game, p: string, location: string, controllerName: string, isProvince?: boolean) => g.facedownCardClicked(p, location, controllerName, isProvince),
        menuButton: (g: Game, p: string, arg: string, uuid: string, method: string) => {
            g.menuButton(p, arg, uuid, method);
        },
        menuItemClick: (g: Game, p: string, cardId: string, menuItem: unknown) => g.menuItemClick(p, cardId, menuItem as MenuItem),
        ringClicked: (g: Game, p: string, ringindex: string) => g.ringClicked(p, ringindex),
        ringMenuItemClick: (g: Game, p: string, sourceRing: { element: string }, menuItem: unknown) => g.ringMenuItemClick(p, sourceRing, menuItem as MenuItem),
        selectDeck: (g: Game, p: string, deck: unknown) => g.selectDeck(p, deck),
        showConflictDeck: (g: Game, p: string) => g.showConflictDeck(p),
        showDynastyDeck: (g: Game, p: string) => g.showDynastyDeck(p),
        shuffleConflictDeck: (g: Game, p: string) => g.shuffleConflictDeck(p),
        shuffleDynastyDeck: (g: Game, p: string) => g.shuffleDynastyDeck(p),
        toggleManualMode: (g: Game, p: string) => g.toggleManualMode(p),
        toggleOptionSetting: (g: Game, p: string, settingName: string, toggle: boolean) => g.toggleOptionSetting(p, settingName, toggle),
        togglePromptedActionWindow: (g: Game, p: string, windowName: string, toggle: boolean) => g.togglePromptedActionWindow(p, windowName, toggle),
        toggleTimerSetting: (g: Game, p: string, settingName: string, toggle: boolean) => g.toggleTimerSetting(p, settingName, toggle)
    } as const satisfies Record<string, (game: Game, player: string, ...args: never[]) => void>;

    onGameMessage(socket: Socket, command: string, ...args: unknown[]) {
        if(!socket.user) {
            return;
        }
        const game = this.findGameForUser(socket.user.username);

        if(!game) {
            return;
        }

        if(command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        const handler = (GameServer.GAME_COMMANDS as Record<string, (game: Game, player: string, ...args: never[]) => void>)[command];
        if(!handler) {
            logger.info(`Rejected unknown game command '${command}' from ${socket.user.username}`);
            return;
        }

        const username = socket.user.username;
        this.runAndCatchErrors(game, () => {
            game.stopNonChessClocks();
            handler(game, username, ...(args as never[]));

            game.continue();

            this.sendGameState(game);
        });
    }
}
