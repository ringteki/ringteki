/* eslint no-invalid-this: 0 */

import { GameModes } from '../../server/GameModes.js';
import './objectformatters.js';
import DeckBuilder, { fillers } from './deckbuilder.js';
import GameFlowWrapper from './gameflowwrapper.js';
import type PlayerInteractionWrapper from './playerinteractionwrapper.js';

const deckBuilder = new DeckBuilder();

const ProxiedGameFlowWrapperMethods = [
    'eachPlayerInFirstPlayerOrder',
    'startGame',
    'keepDynasty',
    'keepConflict',
    'skipSetupPhase',
    'selectFirstPlayer',
    'noMoreActions',
    'selectStrongholdProvinces',
    'advancePhases',
    'getPromptedPlayer',
    'nextPhase',
    'getChatLogs',
    'getChatLog'
] as const;

const customMatchers: any = {
    toHavePrompt: function () {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const currentPrompt = actual.currentPrompt();
                const pass = actual.hasPrompt(expected);
                const message = pass
                    ? `Expected ${actual.name} not to have prompt "${expected}" but it did.`
                    : `Expected ${actual.name} to have prompt "${expected}" but it had menuTitle "${currentPrompt.menuTitle}" and promptTitle "${currentPrompt.promptTitle}".`;
                return { pass, message };
            }
        };
    },
    toHavePromptButton: function (util: any, customEqualityMatchers: any) {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const buttons = actual.currentPrompt().buttons as Array<{ text: string; disabled?: boolean }>;
                const pass = buttons.some(
                    (button) => !button.disabled && util.equals(button.text, expected, customEqualityMatchers)
                );
                let message: string;
                if(pass) {
                    message = `Expected ${actual.name} not to have enabled prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = buttons.map(
                        (button) => '[' + button.text + (button.disabled ? ' (disabled) ' : '') + ']'
                    ).join('\n');
                    message = `Expected ${actual.name} to have enabled prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
                return { pass, message };
            }
        };
    },
    toHaveDisabledPromptButton: function (util: any, customEqualityMatchers: any) {
        return {
            compare: function (actual: PlayerInteractionWrapper, expected: string) {
                const buttons = actual.currentPrompt().buttons as Array<{ text: string; disabled?: boolean }>;
                const pass = buttons.some(
                    (button) => button.disabled && util.equals(button.text, expected, customEqualityMatchers)
                );
                let message: string;
                if(pass) {
                    message = `Expected ${actual.name} not to have disabled prompt button "${expected}" but it did.`;
                } else {
                    const buttonText = buttons.map(
                        (button) => '[' + button.text + (button.disabled ? ' (disabled) ' : '') + ']'
                    ).join('\n');
                    message = `Expected ${actual.name} to have disabled prompt button "${expected}" but it had buttons:\n${buttonText}`;
                }
                return { pass, message };
            }
        };
    },
    toBeAbleToSelect: function () {
        return {
            compare: function (player: PlayerInteractionWrapper, card: unknown) {
                let resolvedCard = card;
                if(typeof card === 'string') {
                    resolvedCard = player.findCardByName(card);
                }
                const pass = player.currentActionTargets.includes(resolvedCard as never);
                const cardName = (resolvedCard as { name?: string })?.name ?? String(resolvedCard);
                const message = pass
                    ? `Expected ${cardName} not to be selectable by ${player.name} but it was.`
                    : `Expected ${cardName} to be selectable by ${player.name} but it wasn't.`;
                return { pass, message };
            }
        };
    },
    toBeAbleToSelectRing: function () {
        return {
            compare: function (player: PlayerInteractionWrapper, ring: unknown) {
                let resolvedRing = ring;
                if(typeof ring === 'string') {
                    resolvedRing = player.player.game.rings[ring];
                }
                const pass = player.currentActionRingTargets.includes(resolvedRing as never);
                const ringElement = (resolvedRing as { element?: string })?.element ?? String(resolvedRing);
                const message = pass
                    ? `Expected ${ringElement} not to be selectable by ${player.name} but it was.`
                    : `Expected ${ringElement} to be selectable by ${player.name} but it wasn't.`;
                return { pass, message };
            }
        };
    }
};

beforeEach(function () {
    jasmine.addMatchers(customMatchers);
});

interface IntegrationDeckOptions {
    faction?: string;
    role?: string;
    stronghold?: string;
    strongholdProvince?: string;
    provinces?: any;
    rings?: string[];
    fate?: number;
    honor?: number;
    inPlay?: any[];
    hand?: string[];
    conflictDiscard?: string[];
    dynastyDiscard?: string[];
    [key: string]: unknown;
}

interface IntegrationSetupOptions {
    player1?: IntegrationDeckOptions;
    player2?: IntegrationDeckOptions;
    gameMode?: GameModes;
    phase?: string;
    skipAutoSetup?: boolean;
    skipAutoFirstPlayer?: boolean;
}

(globalThis as { fillers?: typeof fillers }).fillers = fillers;

(globalThis as { integration?: (definitions: () => void) => void }).integration = function (definitions: () => void): void {
    describe('integration', function (this: unknown) {
        beforeEach(function (this: Record<string, unknown>) {
            const flow = new GameFlowWrapper();
            this.flow = flow;
            this.game = flow.game;
            this.player1Object = flow.game.getPlayerByName('player1');
            this.player2Object = flow.game.getPlayerByName('player2');
            this.player1 = flow.player1;
            this.player2 = flow.player2;

            ProxiedGameFlowWrapperMethods.forEach((method) => {
                this[method] = (...args: unknown[]): unknown =>
                    (flow[method] as (...a: unknown[]) => unknown).apply(flow, args);
            });

            this.buildDeck = function (faction: string, cards: string[]): unknown {
                return deckBuilder.buildDeck(faction, cards);
            };

            this.setupTest = function (this: Record<string, unknown>, options: IntegrationSetupOptions = {}) {
                if(!options.player1) {
                    options.player1 = {};
                }
                if(!options.player2) {
                    options.player2 = {};
                }
                flow.game.gameMode = GameModes.Stronghold;
                if(options.gameMode) {
                    flow.game.gameMode = options.gameMode;
                }

                flow.player1.selectDeck(deckBuilder.customDeck(options.player1, flow.game.gameMode as GameModes));
                flow.player2.selectDeck(deckBuilder.customDeck(options.player2, flow.game.gameMode as GameModes));

                flow.startGame();

                if(!options.skipAutoSetup) {
                    if(!options.skipAutoFirstPlayer) {
                        flow.selectFirstPlayer(flow.player1);
                    }

                    flow.selectStrongholdProvinces({
                        player1: options.player1.strongholdProvince,
                        player2: options.player2.strongholdProvince
                    });
                }

                if(flow.game.gameMode === GameModes.Skirmish) {
                    flow.player1.setupSkirmishProvinces();
                    flow.player2.setupSkirmishProvinces();
                }

                if(options.phase !== 'setup') {
                    if(options.phase && ['draw', 'fate'].includes(options.phase)) {
                        flow.player1.player.promptedActionWindows[options.phase] = true;
                        flow.player2.player.promptedActionWindows[options.phase] = true;
                    }
                    flow.keepDynasty();
                    flow.player1.dynastyDiscard = options.player1.dynastyDiscard;
                    flow.player2.dynastyDiscard = options.player2.dynastyDiscard;

                    flow.keepConflict();

                    flow.advancePhases(options.phase);
                } else {
                    flow.player1.dynastyDiscard = options.player1.dynastyDiscard;
                    flow.player2.dynastyDiscard = options.player2.dynastyDiscard;
                }

                if(options.player1.rings) {
                    options.player1.rings.forEach((ring: string) => flow.player1.claimRing(ring));
                }
                if(options.player2.rings) {
                    options.player2.rings.forEach((ring: string) => flow.player2.claimRing(ring));
                }
                flow.player1.fate = options.player1.fate as number;
                flow.player2.fate = options.player2.fate as number;
                flow.player1.honor = options.player1.honor as number;
                flow.player2.honor = options.player2.honor as number;
                flow.player1.inPlay = (options.player1.inPlay ?? []) as never;
                flow.player2.inPlay = (options.player2.inPlay ?? []) as never;
                flow.player1.hand = (options.player1.hand ?? []) as never;
                flow.player2.hand = (options.player2.hand ?? []) as never;
                flow.player1.conflictDiscard = (options.player1.conflictDiscard ?? []) as never;
                flow.player2.conflictDiscard = (options.player2.conflictDiscard ?? []) as never;
                if(!options.skipAutoSetup) {
                    flow.player1.provinces = options.player1.provinces as never;
                    flow.player2.provinces = options.player2.provinces as never;
                }
                if(options.phase !== 'setup') {
                    for(const location of ['province 1', 'province 2', 'province 3', 'province 4']) {
                        flow.player1.player.replaceDynastyCard(location);
                        flow.player2.player.replaceDynastyCard(location);
                    }
                }
                if(options.phase !== 'setup') {
                    flow.game.checkGameState(true);
                }
            };

            this.initiateConflict = function (this: Record<string, unknown>, options: {
                type?: string;
                ring?: string;
                province?: unknown;
                attackers?: unknown[];
                defenders?: unknown[];
                jumpTo?: boolean;
            } = {}) {
                if(!options.type) {
                    options.type = 'military';
                }
                if(!options.ring) {
                    options.ring = 'air';
                }
                const attackingPlayer = flow.getPromptedPlayer(
                    'Choose an elemental ring\n(click the ring again to change conflict type)'
                );
                if(!attackingPlayer) {
                    throw new Error('Neither player can declare a conflict');
                }
                attackingPlayer.declareConflict(
                    options.type,
                    options.province as never,
                    options.attackers as never,
                    options.ring
                );
                if(!options.defenders) {
                    return;
                }
                const defendingPlayer = flow.getPromptedPlayer('Choose defenders');
                defendingPlayer.assignDefenders(options.defenders as never);
                if(!options.jumpTo) {
                    return;
                }
                flow.noMoreActions();
            };
        });

        definitions();
    });
};
