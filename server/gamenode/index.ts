import pmx from 'pmx';
import { GameServer } from './GameServer.js';

const server = new GameServer();

pmx.action('debug', (reply: any) => {
    reply(server.debugDump());
});
