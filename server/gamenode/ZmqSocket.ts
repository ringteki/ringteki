import config from 'config';
import EventEmitter from 'events';
import zmq from 'zeromq';
import { logger } from '../logger';
import { z } from 'zod';

export class ZmqSocket extends EventEmitter {
    private socket = zmq.socket('dealer');

    constructor(private listenAddress: string, private protocol: string) {
        super();

        this.socket.identity = config.get('gameNode.name');
        this.socket.monitor(500, 0);
        this.socket.connect(config.get('mqUrl'));
        this.socket.on('connect', this.onConnect.bind(this));
        this.socket.on('message', this.onMessage.bind(this));
    }

    public send(command: string, arg?: unknown) {
        this.socket.send(JSON.stringify({ command: command, arg: arg }));
    }

    private onConnect() {
        this.emit('onGameSync', this.onGameSync.bind(this));
    }

    private onGameSync(games: any) {
        if (config.get('gameNode.proxyPort')) {
            this.send('HELLO', {
                maxGames: config.get('maxGames'),
                address: this.listenAddress,
                port: config.get('gameNode.proxyPort'),
                protocol: this.protocol,
                games: games
            });
        } else {
            this.send('HELLO', {
                maxGames: config.get('maxGames'),
                address: this.listenAddress,
                port: config.get('gameNode.socketioPort'),
                protocol: this.protocol,
                games: games
            });
        }
    }

    private parseMsg(msg: unknown) {
        try {
            return z
                .object({
                    command: z.enum(['PING', 'STARTGAME', 'SPECTATOR', 'CONNECTFAILED', 'CLOSEGAME', 'CARDDATA']),
                    arg: z.any()
                })
                .parse(JSON.parse(msg.toString()));
        } catch (e) {
            logger.info(e);
            return;
        }
    }

    private onMessage(x: unknown, msg: string) {
        const message = this.parseMsg(msg);

        switch (message.command) {
            case 'PING':
                this.send('PONG');
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
}
