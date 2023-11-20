import axios from 'axios';
import fs from 'fs';
import http from 'http';
import https from 'https';
import jwt from 'jsonwebtoken';
import socketio from 'socket.io';

import { captureException } from '../ErrorMonitoring';
import Game from '../game/game';
import type Player from '../game/player';
import { logger } from '../logger';
import type PendingGame from '../pendinggame';
import Socket from '../socket';
import { detectBinary } from '../util';
import { ZmqSocket } from './ZmqSocket';
import * as env from '../env.js';

export class GameServer {
    private games = new Map<string, Game>();
    private protocol = 'https';
    private host = env.gameNodeHost;
    private zmqSocket: ZmqSocket;
    private io: socketio.Server;
    private titleCardData: any;
    private shortCardData: any;

    constructor() {
        let privateKey: undefined | string;
        let certificate: undefined | string;
        try {
            privateKey = fs.readFileSync(env.gameNodeKeyPath).toString();
            certificate = fs.readFileSync(env.gameNodeCertPath).toString();
        } catch (e) {
            this.protocol = 'http';
        }

        this.zmqSocket = new ZmqSocket(this.host, this.protocol);
        this.zmqSocket.on('onStartGame', this.onStartGame.bind(this));
        this.zmqSocket.on('onSpectator', this.onSpectator.bind(this));
        this.zmqSocket.on('onGameSync', this.onGameSync.bind(this));
        this.zmqSocket.on('onFailedConnect', this.onFailedConnect.bind(this));
        this.zmqSocket.on('onCloseGame', this.onCloseGame.bind(this));
        this.zmqSocket.on('onCardData', this.onCardData.bind(this));

        const server =
            !privateKey || !certificate
                ? http.createServer()
                : https.createServer({ key: privateKey, cert: certificate });

        server.listen(env.gameNodeSocketIoPort);

        this.io = socketio(server, {
            perMessageDeflate: false,
            path: `/${env.gameNodeName}/socket.io`
        });
        // @ts-ignore
        this.io.set('heartbeat timeout', 30000);
        this.io.use(this.handshake.bind(this));

        if (env.gameNodeOrigin) {
            // @ts-ignore
            this.io.set('origins', env.gameNodeOrigin);
        }

        this.io.on('connection', this.onConnection.bind(this));
    }

    public debugDump() {
        const games = [];
        for (const game of this.games.values()) {
            const players = [];
            for (const player of Object.values<any>(game.playersAndSpectators)) {
                return {
                    name: player.name,
                    left: player.left,
                    disconnected: player.disconnected,
                    id: player.id,
                    spectator: game.isSpectator(player)
                };
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
        logger.error(e);

        let gameState = game.getState();
        let debugData: any = {};

        if (e.message.includes('Maximum call stack')) {
            debugData.badSerializaton = detectBinary(gameState);
        } else {
            debugData.game = gameState;
            debugData.game.players = undefined;

            debugData.messages = game.messages;
            debugData.game.messages = undefined;

            debugData.pipeline = game.pipeline.getDebugInfo();
            debugData.effectEngine = game.effectEngine.getDebugInfo();

            for (const player of game.getPlayers()) {
                debugData[player.name] = player.getState(player);
            }
        }

        captureException(e, { extra: debugData });

        if (game) {
            game.addMessage(
                'A Server error has occured processing your game state, apologies.  Your game may now be in an inconsistent state, or you may be able to continue.  The error has been logged.'
            );
        }
    }

    runAndCatchErrors(game: Game, func: () => void) {
        try {
            func();
        } catch (e) {
            this.handleError(game, e);

            this.sendGameState(game);
        }
    }

    findGameForUser(username: string): undefined | Game {
        for (const game of this.games.values()) {
            const player = game.playersAndSpectators[username];
            if (player && !player.left) {
                return game;
            }
        }
    }

    sendGameState(game: Game): void {
        for (const player of Object.values<Player>(game.getPlayersAndSpectators())) {
            if (player.socket && !player.left && !player.disconnected) {
                player.socket.send('gamestate', game.getState(player.name));
            }
        }
    }

    handshake(socket: socketio.Socket, next: () => void) {
        if (socket.handshake.query.token && socket.handshake.query.token !== 'undefined') {
            jwt.verify(socket.handshake.query.token, env.secret, function (err, user) {
                if (err) {
                    logger.info(err);
                    return;
                }

                socket.request.user = user;
            });
        }

        next();
    }

    gameWon(game: Game, reason: string, winner: Player): void {
        const saveState = game.getSaveState();
        this.zmqSocket.send('GAMEWIN', { game: saveState, winner: winner.name, reason: reason });

        void axios
            .post(
                `https://l5r-analytics-engine-production.up.railway.app/api/game-report/${env.environment}`,
                saveState
            )
            .catch(() => {});
    }

    onStartGame(pendingGame: PendingGame): void {
        const game = new Game(pendingGame, { router: this, shortCardData: this.shortCardData });
        this.games.set(pendingGame.id, game);

        game.started = true;
        for (const player of Object.values<Player>(pendingGame.players)) {
            game.selectDeck(player.name, player.deck);
        }

        game.initialise();
    }

    onSpectator(pendingGame: PendingGame, user) {
        const game = this.games.get(pendingGame.id);
        if (!game) {
            return;
        }

        game.watch('TBA', user);

        this.sendGameState(game);
    }

    onGameSync(callback) {
        const gameSummaries = [];
        for (const game of this.games.values()) {
            const retGame = game.getSummary();
            if (retGame) {
                retGame.password = game.password;
            }
            return gameSummaries.push(retGame);
        }

        logger.info('syncing', gameSummaries.length, ' games');

        callback(gameSummaries);
    }

    onFailedConnect(gameId, username) {
        const game = this.findGameForUser(username);
        if (!game || game.id !== gameId) {
            return;
        }

        game.failedConnect(username);

        if (game.isEmpty()) {
            this.games.delete(game.id);
            this.zmqSocket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onCloseGame(gameId) {
        const game = this.games.get(gameId);
        if (!game) {
            return;
        }

        this.games.delete(gameId);
        this.zmqSocket.send('GAMECLOSED', { game: game.id });
    }

    onCardData(cardData) {
        this.titleCardData = cardData.titleCardData;
        this.shortCardData = cardData.shortCardData;
    }

    onConnection(ioSocket) {
        if (!ioSocket.request.user) {
            logger.info('socket connected with no user, disconnecting');
            ioSocket.disconnect();
            return;
        }

        const game = this.findGameForUser(ioSocket.request.user.username);
        if (!game) {
            logger.info('No game for', ioSocket.request.user.username, 'disconnecting');
            ioSocket.disconnect();
            return;
        }

        const socket = new Socket(ioSocket);

        const player = game.playersAndSpectators[socket.user.username];
        if (!player) {
            return;
        }

        player.lobbyId = player.id;
        player.id = socket.id;
        if (player.disconnected) {
            logger.info("user '%s' reconnected to game", socket.user.username);
            game.reconnect(socket, player.name);
        }

        socket.joinChannel(game.id);

        player.socket = socket;

        if (!game.isSpectator(player)) {
            game.addMessage('{0} has connected to the game server', player);
        }

        this.sendGameState(game);

        socket.registerEvent('game', this.onGameMessage.bind(this));
        socket.on('disconnect', this.onSocketDisconnected.bind(this));
    }

    onSocketDisconnected(socket, reason) {
        const game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        logger.info("user '%s' disconnected from a game: %s", socket.user.username, reason);

        const isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.disconnect(socket.user.username);

        if (game.isEmpty()) {
            this.games.delete(game.id);

            this.zmqSocket.send('GAMECLOSED', { game: game.id });
        } else if (isSpectator) {
            this.zmqSocket.send('PLAYERLEFT', {
                gameId: game.id,
                game: game.getSaveState(),
                player: socket.user.username,
                spectator: true
            });
        }

        this.sendGameState(game);
    }

    onLeaveGame(socket) {
        const game = this.findGameForUser(socket.user.username);
        if (!game) {
            return;
        }

        const isSpectator = game.isSpectator(game.playersAndSpectators[socket.user.username]);

        game.leave(socket.user.username);

        this.zmqSocket.send('PLAYERLEFT', {
            gameId: game.id,
            game: game.getSaveState(),
            player: socket.user.username,
            spectator: isSpectator
        });

        socket.send('cleargamestate');
        socket.leaveChannel(game.id);

        if (game.isEmpty()) {
            this.games.delete(game.id);

            this.zmqSocket.send('GAMECLOSED', { game: game.id });
        }

        this.sendGameState(game);
    }

    onGameMessage(socket, command, ...args) {
        const game = this.findGameForUser(socket.user.username);

        if (!game) {
            return;
        }

        if (command === 'leavegame') {
            return this.onLeaveGame(socket);
        }

        if (!game[command] || typeof game[command] !== 'function') {
            return;
        }

        this.runAndCatchErrors(game, () => {
            game.stopNonChessClocks();
            game[command](socket.user.username, ...args);

            game.continue();

            this.sendGameState(game);
        });
    }
}