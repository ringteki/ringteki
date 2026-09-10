import { GameServer } from '../../server/gamenode/GameServer.js';
import jwt from 'jsonwebtoken';

type GameSpy = jasmine.SpyObj<{
    addAlert: (kind: string, msg: string) => void;
    isEmpty: () => boolean;
    isSpectator: (p: unknown) => boolean;
    leave: (name: string) => void;
    watch: (id: string, user: unknown) => void;
    getSummary: () => unknown;
    getSaveState: () => unknown;
    getState: (name?: string, shared?: unknown) => unknown;
    getSharedState: () => unknown;
    getPlayers: () => unknown[];
    getPlayersAndSpectators: () => Record<string, unknown>;
    addMessage: (msg: string) => void;
    clearAnimations: () => void;
    allPlayersGone: () => boolean;
    recordHiddenInfoIfChanged: () => void;
}> & {
    id: string;
    name: string;
    started: boolean;
    password?: string;
    playersAndSpectators: Record<string, unknown>;
    gameChat: { messages: unknown[] };
    pipeline: { getDebugInfo: () => unknown };
    effectEngine: { getDebugInfo: () => unknown };
};

type ServerCtx = {
    games: Map<string, GameSpy>;
    userGameMap: Map<string, GameSpy>;
    abandonTimers: Map<string, ReturnType<typeof setTimeout>>;
    lastSentMessageCount: Map<string, number>;
    wsSocket: jasmine.SpyObj<{ send: (cmd: string, arg?: unknown) => void }>;
    sendGameState?: (game: unknown) => void;
    notifyAndCloseGame?: (game: unknown) => void;
    handleError?: (game: unknown, e: Error) => void;
    registerUsersForGame?: (game: unknown) => void;
    unregisterUsersForGame?: (game: unknown) => void;
    findGameForUser?: (name: string) => unknown;
    clearMessageCountsForGame?: (game: unknown) => void;
};

const proto = (GameServer as unknown as { prototype: Record<string, (...args: unknown[]) => unknown> }).prototype;

function call<T = unknown>(method: string, ctx: unknown, ...args: unknown[]): T {
    return proto[method].apply(ctx, args) as T;
}

function makeGame(overrides: Partial<{ id: string; name: string; players: Record<string, unknown> }> = {}): GameSpy {
    const game = jasmine.createSpyObj<GameSpy>('game', [
        'addAlert', 'isEmpty', 'isSpectator', 'leave', 'watch', 'getSummary', 'getSaveState',
        'getState', 'getSharedState', 'getPlayers', 'getPlayersAndSpectators', 'addMessage',
        'clearAnimations', 'allPlayersGone', 'recordHiddenInfoIfChanged'
    ]) as GameSpy;
    game.id = overrides.id ?? 'g1';
    game.name = overrides.name ?? 'Test Game';
    game.started = false;
    game.playersAndSpectators = overrides.players ?? {};
    game.gameChat = { messages: [] };
    game.getPlayers.and.returnValue([]);
    game.getPlayersAndSpectators.and.returnValue(game.playersAndSpectators);
    game.isEmpty.and.returnValue(false);
    game.isSpectator.and.returnValue(false);
    game.allPlayersGone.and.returnValue(false);
    return game;
}

function makeCtx(overrides: Partial<ServerCtx> = {}): ServerCtx {
    const ctx = Object.create(proto) as ServerCtx;
    Object.assign(ctx, {
        games: new Map(),
        userGameMap: new Map(),
        abandonTimers: new Map(),
        lastSentMessageCount: new Map(),
        wsSocket: jasmine.createSpyObj('wsSocket', ['send']),
        ...overrides
    });
    return ctx;
}

describe('GameServer.handshake', () => {
    const TEST_SECRET = 'testsecret';

    function fakeSocket(token: unknown): { handshake: { auth: { token: unknown } }; request: { user?: unknown } } {
        return {
            handshake: { auth: { token } },
            request: {}
        };
    }

    it('calls next() with no error when no token is present', (done) => {
        const ctx = makeCtx();
        const socket = fakeSocket(undefined);
        call('handshake', ctx, socket, (err?: Error) => {
            expect(err).toBeUndefined();
            done();
        });
    });

    it('calls next() with no error when token is the string "undefined" (legacy client quirk)', (done) => {
        const ctx = makeCtx();
        const socket = fakeSocket('undefined');
        call('handshake', ctx, socket, (err?: Error) => {
            expect(err).toBeUndefined();
            done();
        });
    });

    it('attaches user and calls next() with no error for a valid JWT', (done) => {
        const ctx = makeCtx();
        const token = jwt.sign({ username: 'alice' }, TEST_SECRET);
        const socket = fakeSocket(token);
        call('handshake', ctx, socket, (err?: Error) => {
            expect(err).toBeUndefined();
            expect((socket.request as { user?: { username: string } }).user?.username).toBe('alice');
            done();
        });
    });

    it('calls next() with "Invalid authentication token" for a malformed JWT', (done) => {
        const ctx = makeCtx();
        const socket = fakeSocket('not.a.valid.token');
        call('handshake', ctx, socket, (err?: Error) => {
            expect(err?.message).toBe('Invalid authentication token');
            done();
        });
    });
});

describe('GameServer.startAbandonTimer / cancelAbandonTimer', () => {
    beforeEach(() => jasmine.clock().install());
    afterEach(() => jasmine.clock().uninstall());

    it('sets a 60s timer that closes the game when both players have left', () => {
        const game = makeGame({ id: 'g1' });
        const notifySpy = jasmine.createSpy('notifyAndCloseGame');
        const sendStateSpy = jasmine.createSpy('sendGameState');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            notifyAndCloseGame: notifySpy,
            sendGameState: sendStateSpy
        });

        call('startAbandonTimer', ctx, game);
        expect(game.addAlert).toHaveBeenCalledWith('info', jasmine.stringContaining('60 seconds'));
        expect(sendStateSpy).toHaveBeenCalledWith(game);
        expect(ctx.abandonTimers.has('g1')).toBe(true);

        jasmine.clock().tick(60_001);
        expect(notifySpy).toHaveBeenCalledWith(game);
        expect(ctx.abandonTimers.has('g1')).toBe(false);
    });

    it('is idempotent: a second start while one is pending does not stack timers', () => {
        const game = makeGame({ id: 'g1' });
        const sendStateSpy = jasmine.createSpy('sendGameState');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            notifyAndCloseGame: jasmine.createSpy(),
            sendGameState: sendStateSpy
        });

        call('startAbandonTimer', ctx, game);
        const firstTimer = ctx.abandonTimers.get('g1');
        call('startAbandonTimer', ctx, game);
        expect(ctx.abandonTimers.get('g1')).toBe(firstTimer);
        expect(sendStateSpy).toHaveBeenCalledTimes(1);
    });

    it('does not close a game that was already removed from the games map before timeout', () => {
        const game = makeGame({ id: 'g1' });
        const notifySpy = jasmine.createSpy('notifyAndCloseGame');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            notifyAndCloseGame: notifySpy,
            sendGameState: jasmine.createSpy()
        });
        call('startAbandonTimer', ctx, game);

        ctx.games.delete('g1');
        jasmine.clock().tick(60_001);
        expect(notifySpy).not.toHaveBeenCalled();
    });

    it('cancelAbandonTimer clears a pending timer', () => {
        const game = makeGame({ id: 'g1' });
        const notifySpy = jasmine.createSpy('notifyAndCloseGame');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            notifyAndCloseGame: notifySpy,
            sendGameState: jasmine.createSpy()
        });
        call('startAbandonTimer', ctx, game);

        call('cancelAbandonTimer', ctx, 'g1');
        expect(ctx.abandonTimers.has('g1')).toBe(false);

        jasmine.clock().tick(60_001);
        expect(notifySpy).not.toHaveBeenCalled();
    });

    it('cancelAbandonTimer is a no-op for absent gameId', () => {
        const ctx = makeCtx();
        expect(() => call('cancelAbandonTimer', ctx, 'missing')).not.toThrow();
    });
});

describe('GameServer.findGameForUser', () => {
    it('returns the game when user is registered', () => {
        const game = makeGame({ id: 'g1' });
        const ctx = makeCtx({ userGameMap: new Map([['alice', game]]) });
        expect(call('findGameForUser', ctx, 'alice')).toBe(game);
    });

    it('returns undefined when user is not registered', () => {
        const ctx = makeCtx();
        expect(call('findGameForUser', ctx, 'ghost')).toBeUndefined();
    });
});

describe('GameServer.registerUsersForGame / unregisterUsersForGame', () => {
    it('registerUsersForGame maps every player+spectator name → game', () => {
        const game = makeGame({ id: 'g1', players: { alice: {}, bob: {} } });
        const ctx = makeCtx();
        call('registerUsersForGame', ctx, game);
        expect(ctx.userGameMap.get('alice')).toBe(game);
        expect(ctx.userGameMap.get('bob')).toBe(game);
    });

    it('unregisterUsersForGame removes only entries that still point to the same game', () => {
        const game = makeGame({ id: 'g1', players: { alice: {}, bob: {} } });
        const otherGame = makeGame({ id: 'g2' });
        const ctx = makeCtx({
            userGameMap: new Map<string, GameSpy>([
                ['alice', game],
                ['bob', otherGame]
            ])
        });
        call('unregisterUsersForGame', ctx, game);
        expect(ctx.userGameMap.has('alice')).toBe(false);
        expect(ctx.userGameMap.get('bob')).toBe(otherGame);
    });
});

describe('GameServer.notifyAndCloseGame', () => {
    it('clears state, removes the game, and sends GAMECLOSED with the gameId', () => {
        const playerSocketSpy = jasmine.createSpyObj<{ send: (k: string, payload?: unknown) => void; leaveChannel: (id: string) => void }>('socket', ['send', 'leaveChannel']);
        const game = makeGame({ id: 'g1' });
        game.getPlayersAndSpectators.and.returnValue({ alice: { socket: playerSocketSpy, disconnected: false, name: 'alice' } });
        const ctx = makeCtx({ games: new Map([['g1', game]]) });

        call('notifyAndCloseGame', ctx, game);

        expect(playerSocketSpy.send).toHaveBeenCalledWith('cleargamestate');
        expect(playerSocketSpy.leaveChannel).toHaveBeenCalledWith('g1');
        expect(ctx.games.has('g1')).toBe(false);
        expect(ctx.wsSocket.send).toHaveBeenCalledWith('GAMECLOSED', { game: 'g1' });
    });

    it('skips socket interaction for disconnected players', () => {
        const playerSocketSpy = jasmine.createSpyObj<{ send: (k: string, payload?: unknown) => void; leaveChannel: (id: string) => void }>('socket', ['send', 'leaveChannel']);
        const game = makeGame({ id: 'g1' });
        game.getPlayersAndSpectators.and.returnValue({ alice: { socket: playerSocketSpy, disconnected: true, name: 'alice' } });
        const ctx = makeCtx({ games: new Map([['g1', game]]) });

        call('notifyAndCloseGame', ctx, game);
        expect(playerSocketSpy.send).not.toHaveBeenCalled();
        expect(ctx.wsSocket.send).toHaveBeenCalledWith('GAMECLOSED', { game: 'g1' });
    });
});

describe('GameServer.handleError', () => {
    function makeErroringGame(pipelineInfo: unknown) {
        const game = makeGame();
        game.getPlayers.and.returnValue([{ name: 'p1' }, { name: 'p2' }]);
        game.pipeline = { getDebugInfo: () => pipelineInfo };
        game.effectEngine = { getDebugInfo: () => ({ effects: [] }) };
        return game;
    }

    function sentPayload(ctx: ServerCtx) {
        const args = ctx.wsSocket.send.calls.mostRecent().args;
        return { command: args[0], arg: args[1] as Record<string, unknown> };
    }

    it('sends the debug data when it is small enough', () => {
        const ctx = makeCtx();
        const game = makeErroringGame({ step: 'ConflictFlow' });

        call('handleError', ctx, game, new Error('boom'));

        const { command, arg } = sentPayload(ctx);
        expect(command).toBe('GAMEERROR');
        expect(arg.errorMessage).toBe('boom');
        expect(arg.debugData).toEqual({ pipeline: { step: 'ConflictFlow' }, effectEngine: { effects: [] } });
    });

    it('drops oversized debug data but still reports the error', () => {
        const ctx = makeCtx();
        const game = makeErroringGame({ blob: 'x'.repeat(5 * 1024 * 1024) });

        call('handleError', ctx, game, new Error('boom'));

        const { command, arg } = sentPayload(ctx);
        expect(command).toBe('GAMEERROR');
        expect(arg.errorMessage).toBe('boom');
        expect(arg.errorStack).toBeDefined();
        expect((arg.debugData as { omitted?: string }).omitted).toContain('over the');
    });

    it('drops debug data that cannot be serialized at all', () => {
        const ctx = makeCtx();
        const game = makeErroringGame({ get boom() {
            throw new Error('nope');
        } });

        call('handleError', ctx, game, new Error('boom'));

        const { arg } = sentPayload(ctx);
        expect(arg.errorMessage).toBe('boom');
        expect((arg.debugData as { omitted?: string }).omitted).toContain('could not be serialized');
    });
});

describe('GameServer.runAndCatchErrors', () => {
    it('runs the function and does not call handleError on success', () => {
        const handleErrorSpy = jasmine.createSpy('handleError');
        const ctx = makeCtx({ handleError: handleErrorSpy, sendGameState: jasmine.createSpy() });
        const fn = jasmine.createSpy('fn').and.returnValue(undefined);
        call('runAndCatchErrors', ctx, makeGame(), fn);
        expect(fn).toHaveBeenCalled();
        expect(handleErrorSpy).not.toHaveBeenCalled();
    });

    it('catches throws, routes to handleError, and re-sends state', () => {
        const handleErrorSpy = jasmine.createSpy('handleError');
        const sendStateSpy = jasmine.createSpy('sendGameState');
        const ctx = makeCtx({ handleError: handleErrorSpy, sendGameState: sendStateSpy });
        const game = makeGame();
        const err = new Error('boom');
        const fn = jasmine.createSpy('fn').and.throwError(err);

        expect(() => call('runAndCatchErrors', ctx, game, fn)).not.toThrow();
        expect(handleErrorSpy).toHaveBeenCalledWith(game, err);
        expect(sendStateSpy).toHaveBeenCalledWith(game);
    });
});

describe('GameServer.onSpectator', () => {
    it('does nothing when the game is unknown', () => {
        const ctx = makeCtx();
        call('onSpectator', ctx, { id: 'ghost' }, { username: 'alice' });
        expect(ctx.userGameMap.size).toBe(0);
    });

    it('registers spectator + sends current state', () => {
        const game = makeGame({ id: 'g1' });
        const sendStateSpy = jasmine.createSpy('sendGameState');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            sendGameState: sendStateSpy
        });

        call('onSpectator', ctx, { id: 'g1' }, { username: 'alice' });
        expect(game.watch).toHaveBeenCalledWith('TBA', jasmine.objectContaining({ username: 'alice' }));
        expect(ctx.userGameMap.get('alice')).toBe(game);
        expect(sendStateSpy).toHaveBeenCalledWith(game);
    });
});

describe('GameServer.onGameSync', () => {
    it('builds a summary array (skipping games whose summary returns undefined) and injects the game password', () => {
        const callback = jasmine.createSpy('callback');
        const g1 = makeGame({ id: 'g1' });
        g1.password = 'secret';
        g1.getSummary.and.returnValue({ id: 'g1' });
        const g2 = makeGame({ id: 'g2' });
        g2.getSummary.and.returnValue(undefined); // simulates "all left" → summary returns undefined
        const ctx = makeCtx({ games: new Map([['g1', g1], ['g2', g2]]) });

        call('onGameSync', ctx, callback);

        const summaries = (callback.calls.mostRecent().args[0] as Array<{ id: string; password?: string }>);
        expect(summaries.length).toBe(1);
        expect(summaries[0]).toEqual(jasmine.objectContaining({ id: 'g1', password: 'secret' }));
    });
});

describe('GameServer.onLeaveGame', () => {
    it('does nothing if socket has no user', () => {
        const ctx = makeCtx();
        const socket = { user: null, id: 'sock1', send: jasmine.createSpy(), leaveChannel: jasmine.createSpy() };
        call('onLeaveGame', ctx, socket);
        expect(ctx.wsSocket.send).not.toHaveBeenCalled();
    });

    it('does nothing if user is in no game', () => {
        const ctx = makeCtx();
        const socket = { user: { username: 'alice' }, id: 'sock1', send: jasmine.createSpy(), leaveChannel: jasmine.createSpy() };
        call('onLeaveGame', ctx, socket);
        expect(ctx.wsSocket.send).not.toHaveBeenCalled();
    });

    it('emits PLAYERLEFT and tears down state for a non-spectator leave that empties the game', () => {
        const game = makeGame({ id: 'g1' });
        game.isSpectator.and.returnValue(false);
        game.isEmpty.and.returnValue(true);
        game.getSaveState.and.returnValue({ gameId: 'g1' });
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            userGameMap: new Map([['alice', game]]),
            sendGameState: jasmine.createSpy('sendGameState')
        });
        const socket = { user: { username: 'alice' }, id: 'sock1', send: jasmine.createSpy(), leaveChannel: jasmine.createSpy() };

        call('onLeaveGame', ctx, socket);

        expect(game.leave).toHaveBeenCalledWith('alice');
        expect(ctx.wsSocket.send).toHaveBeenCalledWith('PLAYERLEFT', jasmine.objectContaining({ gameId: 'g1', player: 'alice', spectator: false }));
        expect(ctx.wsSocket.send).toHaveBeenCalledWith('GAMECLOSED', { game: 'g1' });
        expect(ctx.games.has('g1')).toBe(false);
    });

    it('starts the abandon timer when both players have left but spectators remain', () => {
        const game = makeGame({ id: 'g1' });
        game.isSpectator.and.returnValue(false);
        game.isEmpty.and.returnValue(false);
        game.allPlayersGone.and.returnValue(true);
        game.getSaveState.and.returnValue({ gameId: 'g1' });
        const startAbandonSpy = jasmine.createSpy('startAbandonTimer');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            userGameMap: new Map([['alice', game]]),
            sendGameState: jasmine.createSpy()
        });
        Object.assign(ctx, { startAbandonTimer: startAbandonSpy });
        const socket = { user: { username: 'alice' }, id: 'sock1', send: jasmine.createSpy(), leaveChannel: jasmine.createSpy() };

        call('onLeaveGame', ctx, socket);
        expect(startAbandonSpy).toHaveBeenCalledWith(game);
    });

    it('emits PLAYERLEFT with spectator:true and does not start the abandon timer for a spectator leave', () => {
        const game = makeGame({ id: 'g1' });
        game.isSpectator.and.returnValue(true);
        game.isEmpty.and.returnValue(false);
        game.getSaveState.and.returnValue({ gameId: 'g1' });
        const startAbandonSpy = jasmine.createSpy('startAbandonTimer');
        const ctx = makeCtx({
            games: new Map([['g1', game]]),
            userGameMap: new Map([['alice', game]]),
            sendGameState: jasmine.createSpy()
        });
        Object.assign(ctx, { startAbandonTimer: startAbandonSpy });
        const socket = { user: { username: 'alice' }, id: 'sock1', send: jasmine.createSpy(), leaveChannel: jasmine.createSpy() };

        call('onLeaveGame', ctx, socket);
        expect(ctx.wsSocket.send).toHaveBeenCalledWith('PLAYERLEFT', jasmine.objectContaining({ spectator: true }));
        expect(startAbandonSpy).not.toHaveBeenCalled();
    });
});

describe('GameServer.onFailedConnect', () => {
    it('does nothing when no game is found for user', () => {
        const ctx = makeCtx();
        call('onFailedConnect', ctx, 'g1', 'alice');
        expect(ctx.userGameMap.size).toBe(0);
    });

    it('does nothing when the found game has a different id', () => {
        const game = makeGame({ id: 'other' });
        const failedConnectSpy = (game as unknown as { failedConnect: jasmine.Spy }).failedConnect = jasmine.createSpy();
        const ctx = makeCtx({ userGameMap: new Map([['alice', game]]) });
        call('onFailedConnect', ctx, 'g1', 'alice');
        expect(failedConnectSpy).not.toHaveBeenCalled();
    });

    it('forwards to game.failedConnect and clears userGameMap entry when gameId matches', () => {
        const game = makeGame({ id: 'g1' });
        const failedConnectSpy = (game as unknown as { failedConnect: jasmine.Spy }).failedConnect = jasmine.createSpy();
        const ctx = makeCtx({ userGameMap: new Map([['alice', game]]) });
        call('onFailedConnect', ctx, 'g1', 'alice');
        expect(failedConnectSpy).toHaveBeenCalledWith('alice');
        expect(ctx.userGameMap.has('alice')).toBe(false);
    });
});
