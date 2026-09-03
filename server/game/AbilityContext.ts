import type { SelectChoice } from './AbilityTargets/SelectChoice.js';
import BaseAbility from './BaseAbility.js';
import type BaseCard from './BaseCard.js';
import type CardAbility from './CardAbility.js';
import type DrawCard from './DrawCard.js';
import { Location, PlayType, Stage } from './Constants.js';
import EffectSource from './EffectSource.js';
import type { ElementSymbol } from './ElementSymbol.js';
import type { Event } from './Events/Event.js';
import type Game from './Game.js';
import type { GameAction } from './GameActions/GameAction.js';
import type Player from './Player.js';
import type Ring from './Ring.js';
import type { StatusToken } from './StatusToken.js';

export interface AbilityContextProperties {
    game: Game;
    source?: BaseCard | Ring | EffectSource;
    player?: Player;
    ability?: BaseAbility;
    costs?: Record<string, unknown>;
    targets?: Record<string, BaseCard | BaseCard[]>;
    rings?: Record<string, Ring | Ring[]>;
    selects?: Record<string, SelectChoice>;
    tokens?: Record<string, StatusToken | StatusToken[]>;
    elements?: Record<string, ElementSymbol>;
    events?: Event[];
    stage?: Stage;
    targetAbility?: CardAbility | null;
}

export class AbilityContext<S = BaseCard, T extends BaseCard = BaseCard> {
    game: Game;
    source: S;
    player: Player;
    ability: BaseAbility;
    // Bags are dynamically keyed by per-ability target/cost names; values typed to
    // the union their resolvers produce. cost results are open-ended per cost type
    // (card/array/ring/number/boolean/string), so values are unknown — narrow at read.
    costs: Record<string, unknown>;
    targets: Record<string, BaseCard | BaseCard[]>;
    rings: Record<string, Ring | Ring[]>;
    selects: Record<string, SelectChoice>;
    tokens: Record<string, StatusToken | StatusToken[]>;
    elements: Record<string, ElementSymbol>;
    deckSearchSelected: DrawCard[] = [];
    events: Event[] = [];
    stage: Stage;
    targetAbility: CardAbility | null = null;
    /**
     * Set by `AbilityTargetCard` when the target name is `'target'`. In
     * multi-card selector modes (`Exactly`/`Unlimited` with numCards > 1) it
     * is assigned a `BaseCard[]`; the few cards that use multi-card targets
     * read from `context.targets.target` instead and cast.
     */
    target: T | undefined;
    select: string = '';
    ring: Ring | undefined;
    token: StatusToken | StatusToken[] | undefined;
    element: ElementSymbol | null = null;
    elementCard: BaseCard | undefined;
    provincesToRefill: { player: Player; location: Location }[] = [];
    subResolution = false;
    /** Set when this context continues an earlier one: a sub-resolution (`resolveAbility`/`triggerAbility`) or a `then` clause. */
    originatingContext?: AbilityContext;
    /** Every card chosen as a target across this triggering, continuations included. */
    chosenCardTargets: BaseCard[] = [];
    choosingPlayerOverride: Player | null = null;
    gameActionsResolutionChain: GameAction[] = [];
    playType: PlayType | undefined;
    cardStateWhenInitiated: BaseCard | null = null;
    ignoreFateCost?: boolean;
    payFateCostToOpponent?: boolean;
    onPlayCardSource?: BaseCard;

    constructor(properties: AbilityContextProperties) {
        this.game = properties.game;
        this.source = (properties.source || new EffectSource(this.game)) as S;
        this.player = properties.player as Player;
        this.ability = properties.ability || new BaseAbility({});
        this.costs = properties.costs || {};
        this.targets = properties.targets || {};
        this.rings = properties.rings || {};
        this.selects = properties.selects || {};
        this.tokens = properties.tokens || {};
        this.elements = properties.elements || {};
        this.stage = properties.stage || Stage.Effect;
        this.targetAbility = properties.targetAbility ?? null;
        // const location = this.player && this.player.playableLocations.find(location => location.contains(this.source));
        this.playType = this.player && this.player.findPlayType(this.source as BaseCard); //location && location.playingType;
    }

    /** The context representing the triggering this one belongs to. */
    get triggeringContext(): AbilityContext {
        // S is unconstrained, so `this` is not assignable to the default instantiation.
        return this.originatingContext ?? (this as unknown as AbilityContext);
    }

    copy(newProps: Partial<AbilityContextProperties>): this {
        let copy = this.createCopy(newProps);
        copy.target = this.target;
        copy.token = this.token;
        copy.element = this.element;
        copy.elementCard = this.elementCard;
        copy.select = this.select;
        copy.ring = this.ring;
        copy.provincesToRefill = this.provincesToRefill;
        copy.subResolution = this.subResolution;
        copy.originatingContext = this.originatingContext;
        copy.chosenCardTargets = this.chosenCardTargets;
        copy.choosingPlayerOverride = this.choosingPlayerOverride;
        copy.gameActionsResolutionChain = this.gameActionsResolutionChain;
        copy.playType = this.playType;
        return copy;
    }

    createCopy(newProps: Partial<AbilityContextProperties>): this {
        return new AbilityContext<S, T>(Object.assign(this.getProps(), newProps)) as this;
    }

    refillProvince(player: Player, location: Location): void {
        this.provincesToRefill.push({ player, location });
    }

    getCards<U extends BaseCard = BaseCard>(name: string = 'target'): U[] {
        const slot = this.targets[name];
        if(!slot) {
            return [];
        }
        return (Array.isArray(slot) ? slot : [slot]) as U[];
    }

    refill(): void {
        for(let player of this.game.getPlayersInFirstPlayerOrder()) {
            for(let refill of this.provincesToRefill.filter((refill) => refill.player === player)) {
                this.game.queueSimpleStep(() => {
                    player.replaceDynastyCard(refill.location);
                    return true;
                });
            }
        }
        this.game.queueSimpleStep(() => {
            this.game.checkGameState(true);
        });
    }

    getProps(): AbilityContextProperties {
        return {
            game: this.game,
            source: this.source as BaseCard | Ring | EffectSource,
            player: this.player,
            ability: this.ability,
            costs: Object.assign({}, this.costs),
            targets: Object.assign({}, this.targets),
            rings: Object.assign({}, this.rings),
            selects: Object.assign({}, this.selects),
            tokens: Object.assign({}, this.tokens),
            elements: Object.assign({}, this.elements),
            events: this.events,
            stage: this.stage,
            targetAbility: this.targetAbility
        };
    }
}
