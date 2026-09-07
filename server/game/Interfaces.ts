import type { AbilityContext } from './AbilityContext.js';
import type { EventPayload } from './Events/EventPayloads.js';
import type { TriggeredAbilityContext } from './TriggeredAbilityContext.js';
import type { GameAction } from './GameActions/GameAction.js';
import type { Event } from './Events/Event.js';
import type { Cost } from './costs/Cost.js';
import type { AbilityLimit } from './AbilityLimit.js';
import type { GameObject } from './GameObject.js';
import type Ring from './Ring.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { ProvinceCard } from './ProvinceCard.js';
import type EffectSource from './EffectSource.js';
import type CardAbility from './CardAbility.js';
import type { DuelProperties } from './GameActions/DuelAction.js';
import type { EffectFactory } from './Effects/EffectBuilder.js';
import type { Players, TargetMode, CardType, Location, EventName, Phases } from './Constants.js';
import type { StatusToken } from './StatusToken.js';
import type Player from './Player.js';

interface BaseTarget {
    activePromptTitle?: string;
    location?: Location | Location[];
    controller?: ((context: AbilityContext) => Players) | Players;
    player?: ((context: AbilityContext) => Players.Self | Players.Opponent) | Players.Self | Players.Opponent;
    hideIfNoLegalTargets?: boolean;
    gameAction?: GameAction | GameAction[];
    source?: EffectSource | string;
    buttons?: { text: string; arg: string }[];
}

export interface ChoicesInterface {
    [propName: string]: ((context: AbilityContext) => unknown) | GameAction | GameAction[];
}

interface TargetSelect extends BaseTarget {
    mode: TargetMode.Select;
    choices: (ChoicesInterface | Record<string, never>) | ((context: AbilityContext) => ChoicesInterface | Record<string, never>);
    condition?: (context: AbilityContext) => boolean;
    targets?: boolean;
}

interface TargetRing extends BaseTarget {
    mode: TargetMode.Ring;
    optional?: boolean;
    ringCondition: (ring: Ring, context?: AbilityContext) => boolean;
}

interface TargetAbility extends BaseTarget {
    mode: TargetMode.Ability;
    cardType?: CardType | CardType[];
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    abilityCondition?: (ability: CardAbility) => boolean;
}

interface TargetToken extends BaseTarget {
    mode: TargetMode.Token;
    optional?: boolean;
    location?: Location | Location[];
    cardType?: CardType | CardType[];
    singleToken?: boolean;
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
    tokenCondition?: (token: StatusToken, context?: AbilityContext) => boolean;
}

interface TargetElementSymbol extends BaseTarget {
    mode: TargetMode.ElementSymbol;
    location?: Location | Location[];
    cardType?: CardType | CardType[];
}

interface BaseTargetCard extends BaseTarget {
    cardType?: CardType | CardType[];
    location?: Location | Location[];
    optional?: boolean;
}

interface TargetCardExactlyUpTo extends BaseTargetCard {
    mode: TargetMode.Exactly | TargetMode.UpTo;
    numCards: number;
    sameDiscardPile?: boolean;
}

interface TargetCardExactlyUpToVariable extends BaseTargetCard {
    mode: TargetMode.ExactlyVariable | TargetMode.UpToVariable;
    numCardsFunc: (context: AbilityContext) => number;
}

interface TargetCardMaxStat extends BaseTargetCard {
    mode: TargetMode.MaxStat;
    numCards: number;
    cardStat: (card: DrawCard) => number;
    maxStat: () => number;
}

interface TargetCardSingleUnlimited extends BaseTargetCard {
    mode?: TargetMode.Single | TargetMode.Unlimited;
}

type TargetCard =
    | TargetCardExactlyUpTo
    | TargetCardExactlyUpToVariable
    | TargetCardMaxStat
    | TargetCardSingleUnlimited
    | TargetAbility
    | TargetToken
    | TargetElementSymbol;

interface SubTarget {
    dependsOn?: string;
}

interface ActionCardTarget {
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
}

interface ActionRingTarget {
    ringCondition?: (ring: Ring, context?: AbilityContext) => boolean;
}

type ActionTarget = (TargetCard & ActionCardTarget) | (TargetRing & ActionRingTarget) | TargetSelect | TargetAbility;

interface ActionTargets {
    [propName: string]: ActionTarget & SubTarget;
}

export interface InitiateDuel extends DuelProperties {
    opponentChoosesDuelTarget?: boolean;
    opponentChoosesChallenger?: boolean;
    requiresConflict?: boolean;
    challengerCondition?: (card: DrawCard, context: TriggeredAbilityContext) => boolean;
    targetCondition?: (card: DrawCard, context: TriggeredAbilityContext) => boolean;
}

export type EffectArg =
    | number
    | string
    | Player
    | BaseCard
    | DrawCard
    | ProvinceCard
    | Ring
    | StatusToken
    | undefined
    | null
    | { id: string; label: string; name: string; facedown: boolean; type: CardType }
    | EffectArg[];

interface AbilityProps<Context> {
    title: string;
    location?: Location | Location[];
    cost?: Cost | Cost[];
    limit?: AbilityLimit;
    max?: AbilityLimit;
    target?: ActionTarget;
    targets?: ActionTargets;
    initiateDuel?: InitiateDuel | ((context: AbilityContext) => InitiateDuel);
    cannotBeMirrored?: boolean;
    printedAbility?: boolean;
    cannotTargetFirst?: boolean;
    effect?: string;
    evenDuringDynasty?: boolean;
    effectArgs?: EffectArg | ((context: Context) => EffectArg);
    gameAction?: GameAction | GameAction[];
    handler?: (context: Context) => void;
    then?: ((context: AbilityContext) => object) | object;
}

export interface ActionProps<Source = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<AbilityContext<Source, Target>> {
    condition?: (context: AbilityContext<Source, Target>) => boolean;
    phase?: Phases | 'any';
    emeraldWorksInDynsty?: boolean;
    /**
     * @deprecated
     */
    anyPlayer?: boolean;
    conflictProvinceCondition?: (province: ProvinceCard, context: AbilityContext<Source, Target>) => boolean;
    canTriggerOutsideConflict?: boolean;
}

export interface ConflictActionProps<Source = BaseCard, Target extends BaseCard = BaseCard> extends ActionProps<Source, Target> {
    conflictType?: 'military' | 'political';
    evenFromHome?: boolean;
}

interface TriggeredAbilityCardTarget {
    cardCondition?: (card: DrawCard, context: AbilityContext<DrawCard>) => boolean;
}

interface TriggeredAbilityRingTarget {
    ringCondition?: (ring: Ring, context?: TriggeredAbilityContext) => boolean;
}

type TriggeredAbilityTarget =
    | (TargetCard & TriggeredAbilityCardTarget)
    | (TargetRing & TriggeredAbilityRingTarget)
    | TargetSelect;

interface TriggeredAbilityTargets {
    [propName: string]: TriggeredAbilityTarget & SubTarget & TriggeredAbilityTarget;
}

export type TargetPropertiesInput = (ActionTarget | TriggeredAbilityTarget) & SubTarget;

export type WhenType<Source = BaseCard> = {
    [Evt in EventName]?: (event: EventPayload<Evt>, context: TriggeredAbilityContext<Source>) => unknown;
};

export interface TriggeredAbilityWhenProps<Source = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<TriggeredAbilityContext<Source, Target>> {
    when: WhenType<Source>;
    collectiveTrigger?: boolean;
    anyPlayer?: boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: (context: TriggeredAbilityContext<Source, Target>) => void;
    then?: ((context: TriggeredAbilityContext<Source, Target>) => object) | object;
}

export interface TriggeredAbilityAggregateWhenProps<Source = BaseCard, Target extends BaseCard = BaseCard> extends AbilityProps<TriggeredAbilityContext<Source, Target>> {
    aggregateWhen: (events: Event[], context: TriggeredAbilityContext<Source, Target>) => boolean;
    collectiveTrigger?: boolean;
    target?: TriggeredAbilityTarget & TriggeredAbilityTarget;
    targets?: TriggeredAbilityTargets;
    handler?: (context: TriggeredAbilityContext<Source, Target>) => void;
    then?: ((context: TriggeredAbilityContext<Source, Target>) => object) | object;
}

export type TriggeredAbilityProps<Source = BaseCard, Target extends BaseCard = BaseCard> = TriggeredAbilityWhenProps<Source, Target> | TriggeredAbilityAggregateWhenProps<Source, Target>;

export interface PersistentEffectProps<Source = BaseCard, MatchTarget extends GameObject = GameObject> {
    location?: Location | Location[];
    condition?: (context: AbilityContext<Source>) => boolean;
    match?: (card: MatchTarget, context?: AbilityContext<Source>) => boolean;
    targetController?: Players;
    targetLocation?: Location | (string & {});
    effect: EffectFactory | EffectFactory[];
    createCopies?: boolean;
}

export type traitLimit = {
    [trait: string]: number;
};

export interface AttachmentConditionProps {
    limit?: number;
    myControl?: boolean;
    opponentControlOnly?: boolean;
    unique?: boolean;
    faction?: string | string[];
    trait?: string | string[];
    limitTrait?: traitLimit | traitLimit[];
    cardCondition?: (card: DrawCard) => boolean;
}

interface HonoredToken {
    honored: true;
    card: DrawCard;
    type: 'token';
}

interface DishonoredToken {
    dishonored: true;
    card: DrawCard;
    type: 'token';
}

export type Token = HonoredToken | DishonoredToken;
