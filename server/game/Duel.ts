import { GameObject } from './GameObject';
import { DuelTypes, EffectNames, EventNames, Locations } from './Constants';
import { GameMode, parseGameMode } from './GameMode';
import { EventRegistrar } from './EventRegistrar';
import type DrawCard from './drawcard';
import type Game from './game';
import type Player from './player';

/**
 * Used to track whether a player has played a specific type of duel effect yet
 */
export interface DuelAbilities {
    challenge: boolean,
    focus: boolean,
    strike: boolean,
}

enum DuelParticipants {
    Challenger,
    Target
}

const InvalidStats = Symbol('Invalid stats');

type StatisticTotal = typeof InvalidStats | number;

const listFormatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

export class Duel extends GameObject {
    #bidFinished = false;
    loser?: DrawCard[];
    losingPlayer?: Player;
    previousDuel?: Duel;
    winner?: DrawCard[];
    winningPlayer?: Player;
    gameModeOpts: GameMode;
    modifiers: Map<string, DuelAbilities>;
    private eventRegistrar?: EventRegistrar;

    constructor(
        public game: Game,
        public challenger: DrawCard,
        public targets: DrawCard[],
        private duelType: DuelTypes,
        private statistic?: (card: DrawCard) => number,
        private challengingPlayer = challenger.controller
    ) {
        super(game, 'Duel');
        this.gameModeOpts = parseGameMode(this.game.gameMode);
        this.#initializeDuelModifiers(challenger.controller);

        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnCardAbilityTriggered]);
    }

    get winnerController(): undefined | Player {
        return this.winner?.[0].controller;
    }

    get loserController(): undefined | Player {
        return this.loser?.[0].controller;
    }

    isInvolved(card: DrawCard): boolean {
        return card.location === Locations.PlayArea && (card === this.challenger || this.targets.includes(card));
    }

    isInvolvedInAnyDuel(card: DrawCard): boolean {
        return this.isInvolved(card) || (this.previousDuel && this.previousDuel.isInvolvedInAnyDuel(card));
    }

    getTotalsForDisplay(): string {
        const rawChallenger = this.#getStatsTotal([this.challenger]);
        const rawTarget = this.#getStatsTotal(this.targets);
        const [challengerTotal, targetTotal] = this.#getTotals(
            typeof rawChallenger === 'number' ? rawChallenger : 0,
            typeof rawTarget === 'number' ? rawTarget : 0
        );
        return `${
            this.challenger.name
        }: ${challengerTotal.toString()} vs ${targetTotal.toString()}: ${this.#getTargetName()}`;
    }

    modifyDuelingSkill(): void {
        this.#bidFinished = true;
    }

    determineResult(): void {
        const challengerWins = this.challenger.mostRecentEffect(EffectNames.WinDuel) === this;
        if (challengerWins) {
            this.#setWinner(DuelParticipants.Challenger);
            this.#setLoser(DuelParticipants.Target);
        } else {
            const challengerStats = this.#getStatsTotal([this.challenger]);
            const targetStats = this.#getStatsTotal(this.targets);
            if (challengerStats === InvalidStats) {
                if (targetStats !== InvalidStats && targetStats > 0) {
                    // Challenger dead, target alive
                    this.#setWinner(DuelParticipants.Target);
                }
                // Both dead
            } else if (targetStats === InvalidStats) {
                // Challenger alive, target dead
                if (challengerStats > 0) {
                    this.#setWinner(DuelParticipants.Challenger);
                }
            } else {
                const [challengerStats2, targetStats2] = this.#getTotals(challengerStats, targetStats);

                if (challengerStats2 > targetStats2) {
                    // Both alive, challenger wins
                    this.#setWinner(DuelParticipants.Challenger);
                    this.#setLoser(DuelParticipants.Target);
                } else if (challengerStats2 < targetStats2) {
                    // Both alive, target wins
                    this.#setWinner(DuelParticipants.Target);
                    this.#setLoser(DuelParticipants.Challenger);
                }
            }
        }

        const losers =
            this.loser?.filter((card) => card.checkRestrictions('loseDuels', card.game.getFrameworkContext())) ?? [];
        if (losers.length > 0) {
            this.loser = losers;
        } else {
            this.loser = undefined;
            this.losingPlayer = undefined;
        }

        if ((this.winner?.length ?? 0) > 0) {
            this.winner = this.winner;
        } else {
            this.winner = undefined;
            this.winningPlayer = undefined;
        }
    }

    #getStatsTotal(charactersOnSameSide: DrawCard[]): StatisticTotal {
        let result = 0;
        for (const card of charactersOnSameSide) {
            if (card.location !== Locations.PlayArea) {
                return InvalidStats;
            }
            result += this.#getSkillStatistic(card);
        }
        return result;
    }

    #getSkillStatistic(card: DrawCard): number {
        const rawEffects = card.getRawEffects().filter((effect) => effect.type === EffectNames.ModifyDuelSkill);
        let baseStatistic = 0;
        let effectModifier = 0;

        rawEffects.forEach(effect => {
            const props = effect.getValue();
            if (props.duel === this) {
                effectModifier += props.value;
            }
        })

        if (this.statistic) {
            baseStatistic = this.statistic(card);
        } else {
            switch (this.duelType) {
                case DuelTypes.Military:
                    baseStatistic = this.gameModeOpts.duelRules === 'printedSkill'
                        ? card.printedMilitarySkill
                        : card.getMilitarySkill();
                    break;
                case DuelTypes.Political:
                    baseStatistic = this.gameModeOpts.duelRules === 'printedSkill'
                        ? card.printedPoliticalSkill
                        : card.getPoliticalSkill();
                    break;
                case DuelTypes.Glory:
                    baseStatistic = this.gameModeOpts.duelRules === 'printedSkill' ? card.printedGlory : card.glory;
                    break;
            }
        }

        return baseStatistic + effectModifier;
    }

    #getTotals(challengerStats: number, targetStats: number): [number, number] {
        if (this.gameModeOpts.duelRules === 'skirmish') {
            if (challengerStats > targetStats) {
                challengerStats = 1;
                targetStats = 0;
            } else if (challengerStats < targetStats) {
                challengerStats = 0;
                targetStats = 1;
            } else {
                challengerStats = 0;
                targetStats = 0;
            }
        }

        if (this.#bidFinished) {
            challengerStats += this.challengingPlayer.honorBid;
            if (this.targets?.length > 0) {
                targetStats += this.challengingPlayer.opponent.honorBid;
            }
        }

        return [challengerStats, targetStats];
    }

    #getTargetName() {
        return listFormatter.format(this.targets.map((c) => c.name));
    }

    #setWinner(winner: DuelParticipants) {
        switch (winner) {
            case DuelParticipants.Challenger: {
                this.winner = [this.challenger];
                this.winningPlayer = this.challengingPlayer;
                return;
            }
            case DuelParticipants.Target: {
                this.winner = this.targets;
                this.winningPlayer = this.challengingPlayer.opponent;
                return;
            }
        }
    }

    #setLoser(loser: DuelParticipants) {
        switch (loser) {
            case DuelParticipants.Challenger: {
                this.loser = [this.challenger];
                this.losingPlayer = this.challengingPlayer;
                return;
            }
            case DuelParticipants.Target: {
                this.loser = this.targets;
                this.losingPlayer = this.challengingPlayer.opponent;
                return;
            }
        }
    }

    #initializeDuelModifiers(challengingPlayer: Player) {
        this.modifiers = new Map();
        this.modifiers.set(challengingPlayer.id, {
            challenge: false,
            focus: false,
            strike: false
        })
        if (challengingPlayer.opponent) {
            this.modifiers.set(challengingPlayer.opponent.id, {
                challenge: false,
                focus: false,
                strike: false
            })
        }
    }

    cleanup() {
        this.eventRegistrar.unregisterAll();
    }

    onCardAbilityTriggered(_event: any) {
        const event = _event.context.event;

        if (event.duel !== this) {
            return;
        }

        if (event.name === EventNames.OnDuelChallenge) {
            const player = _event.context.player;
            const mods = this.modifiers.get(player.id);
            mods.challenge = true;
        }

        if (event.name === EventNames.OnDuelFocus) {
            const player = _event.context.player;
            const mods = this.modifiers.get(player.id);
            mods.focus = true;
        }

        if (event.name === EventNames.OnDuelStrike) {
            const player = _event.context.player;
            const mods = this.modifiers.get(player.id);
            mods.strike = true;
        }
    }
}
