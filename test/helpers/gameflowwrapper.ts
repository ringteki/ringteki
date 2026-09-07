import Game from '../../server/game/Game.js';
import PlayerInteractionWrapper from './playerinteractionwrapper.js';
import * as Settings from '../../server/settings.js';
import { cards as cardLibrary } from '../../server/game/cards/index.js';
import type { GameRouter } from '../../server/game/GameRouter.js';

class GameFlowWrapper {
    game: Game;
    player1: PlayerInteractionWrapper;
    player2: PlayerInteractionWrapper;
    allPlayers: PlayerInteractionWrapper[];

    constructor() {
        const gameRouter = jasmine.createSpyObj('gameRouter', ['gameWon', 'playerLeft', 'handleError']);
        (gameRouter.handleError as jasmine.Spy).and.callFake((_game: Game, error: Error) => {
            throw error;
        });
        const details = {
            name: 'player1\'s game',
            id: '12345',
            owner: 'player1',
            saveGameId: '12345',
            allowSpectators: false,
            spectatorSquelch: false,
            gameType: 'casual',
            gameMode: 'stronghold',
            clocks: null,
            players: {
                '111': { id: '111', user: Settings.getUserWithDefaultsSet({ username: 'player1' }) },
                '222': { id: '222', user: Settings.getUserWithDefaultsSet({ username: 'player2' }) }
            },
            spectators: {}
        } as ConstructorParameters<typeof Game>[0];
        this.game = new Game(details, { router: gameRouter as GameRouter, cardLibrary });
        this.game.started = true;

        const player1Obj = this.game.getPlayerByName('player1');
        const player2Obj = this.game.getPlayerByName('player2');
        if(!player1Obj || !player2Obj) {
            throw new Error('Failed to construct game players');
        }
        this.player1 = new PlayerInteractionWrapper(this.game, player1Obj);
        this.player2 = new PlayerInteractionWrapper(this.game, player2Obj);
        this.player1.player.timerSettings.events = false;
        this.player2.player.timerSettings.events = false;
        this.allPlayers = [this.player1, this.player2];
    }

    get firstPlayer(): PlayerInteractionWrapper | undefined {
        return this.allPlayers.find((player) => player.firstPlayer);
    }

    get rings(): Game['rings'] {
        return this.game.rings;
    }

    eachPlayerInFirstPlayerOrder(handler: (player: PlayerInteractionWrapper) => void): void {
        const playersInOrder = this.allPlayers.slice().sort(
            (a, b) => (b.firstPlayer ? 1 : 0) - (a.firstPlayer ? 1 : 0)
        );
        playersInOrder.forEach((player) => handler(player));
    }

    eachPlayerStartingWithPrompted(handler: (player: PlayerInteractionWrapper) => void): void {
        const playersInPromptedOrder = this.allPlayers.slice().sort(
            (a, b) =>
                (a.hasPrompt('Waiting for opponent to take an action or pass') ? 1 : 0) -
                (b.hasPrompt('Waiting for opponent to take an action or pass') ? 1 : 0)
        );
        playersInPromptedOrder.forEach((player) => handler(player));
    }

    startGame(): void {
        (this.game as { initialise: () => void }).initialise();
    }

    selectStrongholdProvinces(strongholds: { player1?: string; player2?: string } = {}): void {
        this.guardCurrentPhase('setup');
        this.player1.selectStrongholdProvince(strongholds.player1 || 'shameful-display');
        this.player2.selectStrongholdProvince(strongholds.player2 || 'shameful-display');
    }

    keepDynasty(): void {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    keepConflict(): void {
        this.guardCurrentPhase('setup');
        this.eachPlayerInFirstPlayerOrder((player) => player.clickPrompt('Done'));
    }

    skipSetupPhase(): void {
        this.selectFirstPlayer(this.player1);
        this.selectStrongholdProvinces();
        this.keepDynasty();
        this.keepConflict();
    }

    noMoreActions(): void {
        if(this.game.currentPhase === 'dynasty') {
            this.eachPlayerStartingWithPrompted((player) => {
                if(!player.player.passedDynasty) {
                    player.clickPrompt('Pass');
                }
            });
        } else {
            this.eachPlayerStartingWithPrompted((player) => player.clickPrompt('Pass'));
        }
    }

    finishConflictPhase(): void {
        this.guardCurrentPhase('conflict');
        while(this.player1.player.getConflictOpportunities() > 0 ||
            this.player2.player.getConflictOpportunities() > 0) {
            try {
                this.noMoreActions();
            } catch {
                const playersInPromptedOrder = this.allPlayers.slice().sort(
                    (a, b) =>
                        (a.hasPrompt('Waiting for opponent to declare conflict') ? 1 : 0) -
                        (b.hasPrompt('Waiting for opponent to declare conflict') ? 1 : 0)
                );
                playersInPromptedOrder[0].clickPrompt('Pass Conflict');
                playersInPromptedOrder[0].clickPrompt('yes');
            }
        }
        this.noMoreActions();
        const claimingPlayer = this.allPlayers.find(
            (player) => player.hasPrompt('Which side of the Imperial Favor would you like to claim?')
        );
        if(claimingPlayer) {
            claimingPlayer.clickPrompt('military');
        }
    }

    finishFatePhase(): void {
        for(const player of this.allPlayers) {
            if(player.currentPrompt().menuTitle === 'Fate Phase') {
                player.clickPrompt('Done');
            }
        }
        const playersInPromptedOrder = this.allPlayers.slice().sort(
            (a, b) =>
                (a.hasPrompt('Waiting for opponent to discard dynasty cards') ? 1 : 0) -
                (b.hasPrompt('Waiting for opponent to discard dynasty cards') ? 1 : 0)
        );
        playersInPromptedOrder.forEach((player) => {
            if(player.hasPromptButton('Done')) {
                player.clickPrompt('Done');
            }
        });
        const promptedToEnd = this.allPlayers.slice().sort(
            (a, b) =>
                (a.hasPrompt('Waiting for opponent to end the round') ? 1 : 0) -
                (b.hasPrompt('Waiting for opponent to end the round') ? 1 : 0)
        );
        promptedToEnd.forEach((player) => player.clickPrompt('End Round'));
        this.guardCurrentPhase('dynasty');
    }

    finishRegroupPhase(): void {
        this.guardCurrentPhase('regroup');
        const playersInPromptedOrder = this.allPlayers.slice().sort(
            (a, b) =>
                (a.hasPrompt('Waiting for opponent to discard dynasty cards') ? 1 : 0) -
                (b.hasPrompt('Waiting for opponent to discard dynasty cards') ? 1 : 0)
        );
        playersInPromptedOrder.forEach((player) => {
            if(player.hasPromptButton('Done')) {
                player.clickPrompt('Done');
            }
        });
        const promptedToEnd = this.allPlayers.slice().sort(
            (a, b) =>
                (a.hasPrompt('Waiting for opponent to end the round') ? 1 : 0) -
                (b.hasPrompt('Waiting for opponent to end the round') ? 1 : 0)
        );
        promptedToEnd.forEach((player) => player.clickPrompt('End Round'));
        this.guardCurrentPhase('dynasty');
    }

    nextPhase(): number {
        let phaseChange = 0;
        switch(this.game.currentPhase) {
            case 'setup':
                this.skipSetupPhase();
                break;
            case 'dynasty':
                this.noMoreActions();
                phaseChange = -1;
                break;
            case 'draw':
                this.bidHonor();
                phaseChange = -1;
                break;
            case 'conflict':
                this.finishConflictPhase();
                phaseChange = -1;
                break;
            case 'fate':
                this.finishFatePhase();
                phaseChange = -1;
                break;
            case 'regroup':
                this.finishRegroupPhase();
                phaseChange = 4;
                break;
            default:
                break;
        }
        return phaseChange;
    }

    advancePhases(endphase?: string): void {
        if(!endphase) {
            return;
        }
        while(this.game.currentPhase !== endphase) {
            this.nextPhase();
        }
    }

    bidHonor(player1amt?: number, player2amt?: number): void {
        this.guardCurrentPhase('draw');
        this.player1.bidHonor(player1amt);
        this.player2.bidHonor(player2amt);
        if(this.game.currentPhase === 'draw') {
            this.eachPlayerInFirstPlayerOrder((player) => {
                if(player.hasPrompt('Triggered Abilities')) {
                    player.pass();
                }
            });
        }
        this.guardCurrentPhase('conflict');
    }

    guardCurrentPhase(phase: string): void {
        if(this.game.currentPhase !== phase) {
            throw new Error(`Expected to be in the ${phase} phase but actually was ${this.game.currentPhase}`);
        }
    }

    getPromptedPlayer(title: string): PlayerInteractionWrapper {
        const promptedPlayer = this.allPlayers.find((p) => p.hasPrompt(title));

        if(!promptedPlayer) {
            const promptString = this.allPlayers.map((player) => player.name + ': ' + player.formatPrompt()).join('\n\n');
            throw new Error(`No players are being prompted with "${title}". Current prompts are:\n\n${promptString}`);
        }

        return promptedPlayer;
    }

    selectFirstPlayer(player: PlayerInteractionWrapper): void {
        const promptedPlayer = this.getPromptedPlayer('You won the flip. Do you want to be:');
        if(player === promptedPlayer) {
            promptedPlayer.clickPrompt('First Player');
        } else {
            promptedPlayer.clickPrompt('Second Player');
        }
    }

    getChatLogs(numBack: number = 1, reverse: boolean = true): string[] {
        const results: string[] = [];
        for(let i = 0; i < this.game.messages.length && i < numBack; i++) {
            let result = '';
            const chatMessage = this.game.messages[this.game.messages.length - i - 1];
            const message = chatMessage.message;
            if(typeof message === 'string') {
                result += getChatString(message);
            } else if(Array.isArray(message)) {
                for(let j = 0; j < message.length; j++) {
                    result += getChatString(message[j]);
                }
            }
            results.push(result);
        }

        return reverse ? results.reverse() : results;

        function getChatString(item: unknown): string {
            if(Array.isArray(item)) {
                return item.map((arrItem) => getChatString(arrItem)).join('');
            } else if(item instanceof Object) {
                const obj = item as { name?: string; message?: unknown };
                if(obj.name) {
                    return obj.name;
                } else if(obj.message) {
                    return getChatString(obj.message);
                }
            }
            return String(item);
        }
    }

    getChatLog(numBack: number = 0): string {
        const messages = this.getChatLogs(numBack + 1, false);
        return messages.length && messages[numBack] ? messages[numBack] : '<No Message Found>';
    }
}

export default GameFlowWrapper;
