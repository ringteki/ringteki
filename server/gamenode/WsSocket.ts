import EventEmitter from 'events';
import WebSocket from 'ws';
import * as env from '../env.js';
import { logger } from '../logger.js';
import {
    InboundMessageSchema,
    PROTOCOL_VERSION,
    type GameClosedPayload,
    type GameErrorPayload,
    type GameSummary,
    type GameWinPayload,
    type HelloPayload,
    type PlayerLeftPayload
} from './LobbyProtocol.js';

const TEN_SECONDS = 10_000;
const ONE_SECOND = 1_000;
const MAX_RECONNECT_DELAY = 5_000;

// Error payloads carry game debug data, which can contain references back to the
// Game object. Replace cycles instead of throwing so the report still gets sent.
function stringifyWithoutCycles(value: unknown): string {
    const ancestors: unknown[] = [];

    return JSON.stringify(value, function(this: unknown, _key: string, val: unknown) {
        if(typeof val !== 'object' || val === null) {
            return val;
        }

        while(ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
            ancestors.pop();
        }

        if(ancestors.includes(val)) {
            return '[Circular]';
        }

        ancestors.push(val);
        return val;
    });
}

export class WsSocket extends EventEmitter {
    private ws: WebSocket | null = null;
    private running = false;
    private registered = false;
    private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private reconnectDelay = ONE_SECOND;
    private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(private listenAddress: string, private protocol: string) {
        super();

        this.running = true;
        process.nextTick(() => this.connect());

        this.heartbeatInterval = setInterval(() => {
            if(this.registered) {
                logger.debug(`${env.gameNodeName} sending HEARTBEAT`);
                this.send('HEARTBEAT');
            } else {
                logger.info(`${env.gameNodeName} not registered, re-sending HELLO`);
                this.emit('onGameSync', this.onGameSync.bind(this));
            }
        }, TEN_SECONDS);
    }

    private connect() {
        const secretParam = env.nodeSecret ? `&secret=${encodeURIComponent(env.nodeSecret)}` : '';
        const url = `${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}${secretParam}`;
        logger.info(`${env.gameNodeName} connecting to lobby at ${env.lobbyWsUrl}?identity=${encodeURIComponent(env.gameNodeName)}`);

        this.ws = new WebSocket(url);

        this.ws.on('open', () => {
            logger.info(`${env.gameNodeName} connected to lobby`);
            this.reconnectDelay = ONE_SECOND;
            this.emit('onGameSync', this.onGameSync.bind(this));
        });

        this.ws.on('message', (data: WebSocket.RawData) => {
            this.onMessage(data.toString());
        });

        this.ws.on('close', () => {
            logger.info(`${env.gameNodeName} disconnected from lobby`);
            this.registered = false;
            this.scheduleReconnect();
        });

        this.ws.on('error', (err: Error) => {
            logger.error(`WebSocket error: ${err.message}`);
        });
    }

    private scheduleReconnect() {
        if(!this.running) {
            return;
        }

        logger.info(`${env.gameNodeName} reconnecting in ${this.reconnectDelay}ms`);
        this.reconnectTimer = setTimeout(() => {
            if(this.running) {
                this.connect();
            }
        }, this.reconnectDelay);

        this.reconnectDelay = Math.min(this.reconnectDelay * 2, MAX_RECONNECT_DELAY);
    }

    public send(command: 'HEARTBEAT' | 'PONG'): void;
    public send(command: 'HELLO', arg: HelloPayload): void;
    public send(command: 'GAMEERROR', arg: GameErrorPayload): void;
    public send(command: 'GAMECLOSED', arg: GameClosedPayload): void;
    public send(command: 'GAMEWIN', arg: GameWinPayload): void;
    public send(command: 'PLAYERLEFT', arg: PlayerLeftPayload): void;
    public send(command: string, arg?: unknown): void {
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            logger.debug(`Cannot send ${command}, WebSocket not open`);
            return;
        }

        try {
            this.ws.send(stringifyWithoutCycles({ command, arg }));
        } catch(err) {
            logger.error(`Error sending message: ${err}`);
        }
    }

    private onGameSync(games: GameSummary[]) {
        const port = env.gameNodeProxyPort ?? env.gameNodeSocketIoPort;
        logger.info(`${env.gameNodeName} sending HELLO to lobby (address=${this.listenAddress}, port=${port}, games=${games.length})`);
        this.send('HELLO', {
            maxGames: env.maxGames,
            address: this.listenAddress,
            port: port,
            protocol: this.protocol,
            version: env.buildVersion,
            protocolVersion: PROTOCOL_VERSION,
            games: games
        });
    }

    private parseMsg(msg: string) {
        try {
            return InboundMessageSchema.parse(JSON.parse(msg));
        } catch(e) {
            logger.info(`Failed to parse message: ${e}`);
            return undefined;
        }
    }

    private onMessage(msg: string) {
        const message = this.parseMsg(msg);

        if(!message) {
            return;
        }

        if(message.command === 'PING') {
            logger.debug(`${env.gameNodeName} received PING from lobby`);
        } else {
            logger.info(`${env.gameNodeName} received ${message.command} from lobby`);
        }

        this.registered = true;

        switch(message.command) {
            case 'PING':
                this.send('PONG');
                break;
            case 'REGISTER':
                logger.info('Lobby requested re-registration');
                this.registered = false;
                this.emit('onGameSync', this.onGameSync.bind(this));
                break;
            case 'STARTGAME':
                this.emit('onStartGame', message.arg);
                break;
            case 'SPECTATOR':
                this.emit('onSpectator', message.arg.game, message.arg.user);
                break;
            case 'CONNECTFAILED':
                this.emit('onFailedConnect', message.arg.gameId, message.arg.username);
                break;
            case 'CLOSEGAME':
                this.emit('onCloseGame', message.arg.gameId);
                break;
            case 'CARDDATA':
                this.emit('onCardData', message.arg);
                break;
        }
    }

    public close() {
        this.running = false;
        if(this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        if(this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        if(this.ws) {
            this.ws.close();
        }
    }
}
