import DrawCard from '../DrawCard.js';
import { AddTokenAction, AddTokenProperties } from './AddTokenAction.js';
import { AffinityAction, AffinityActionProperties } from './AffinityAction.js';
import { AttachAction, AttachActionProperties } from './AttachAction.js';
import { AttachToRingAction, AttachToRingActionProperties } from './AttachToRingAction.js';
import { BowAction, BowActionProperties } from './BowAction.js';
import { BreakAction, BreakProperties } from './BreakAction.js';
import { CancelAction, CancelActionProperties } from './CancelAction.js';
import { CardGameAction } from './CardGameAction.js';
import { CardMenuAction, CardMenuProperties } from './CardMenuAction.js';
import { ChooseActionProperties, ChooseGameAction } from './ChooseGameAction.js';
import { ChosenDiscardAction, ChosenDiscardProperties } from './ChosenDiscardAction.js';
import { ChosenReturnToDeckAction, ChosenReturnToDeckProperties } from './ChosenReturnToDeckAction.js';
import { ClaimFavorAction, ClaimFavorProperties } from './ClaimFavorAction.js';
import { ClaimRingAction, ClaimRingProperties } from './ClaimRingAction.js';
import { ConditionalAction, ConditionalActionProperties } from './ConditionalAction.js';
import { CreateTokenAction, CreateTokenProperties } from './CreateTokenAction.js';
import { DeckSearchAction, DeckSearchProperties } from './DeckSearchAction.js';
import { DetachAction, DetachActionProperties } from './DetachAction.js';
import { DiscardCardAction, DiscardCardProperties } from './DiscardCardAction.js';
import { DiscardFavorAction, DiscardFavorProperties } from './DiscardFavorAction.js';
import { DiscardFromPlayAction, DiscardFromPlayProperties } from './DiscardFromPlayAction.js';
import { DiscardStatusAction, DiscardStatusProperties } from './DiscardStatusAction.js';
import { DishonorAction, DishonorProperties } from './DishonorAction.js';
import { DishonorProvinceAction, DishonorProvinceProperties } from './DishonorProvinceAction.js';
import { DrawAction, DrawProperties } from './DrawAction.js';
import { DuelAction, DuelProperties } from './DuelAction.js';
import { DuelAddParticipantAction, DuelAddParticipantProperties } from './DuelAddParticipantAction.js';
import { FateBidAction, FateBidProperties } from './FateBidAction.js';
import { FillProvinceAction, FillProvinceProperties } from './FillProvinceAction.js';
import { FlipDynastyAction, FlipDynastyProperties } from './FlipDynastyAction.js';
import { FlipFavorAction, FlipFavorProperties } from './FlipFavorAction.js';
import { GainFateAction, GainFateProperties } from './GainFateAction.js';
import { GainHonorAction, GainHonorProperties } from './GainHonorAction.js';
import { GainStatusTokenAction, GainStatusTokenProperties } from './GainStatusTokenAction.js';
import { GameAction } from './GameAction.js';
import { GloryCountAction, GloryCountProperties } from './GloryCountAction.js';
import { HandlerAction, HandlerProperties } from './HandlerAction.js';
import { HonorAction, HonorProperties } from './HonorAction.js';
import { HonorBidAction, HonorBidProperties } from './HonorBidAction.js';
import { IfAbleAction, IfAbleActionProperties } from './IfAbleAction.js';
import { InitiateConflictAction, InitiateConflictProperties } from './InitiateConflictAction.js';
import { InjureAction, InjureActionProperties } from './InjureAction.js';
import { JointGameAction } from './JointGameAction.js';
import { JointGameContextProperties, JointGameContextAction } from './JointGameContextAction.js';
import { LastingEffectAction, LastingEffectProperties } from './LastingEffectAction.js';
import { LastingEffectCardAction, LastingEffectCardProperties } from './LastingEffectCardAction.js';
import { LastingEffectRingAction, LastingEffectRingProperties } from './LastingEffectRingAction.js';
import { LookAtAction, LookAtProperties } from './LookAtAction.js';
import { LoseFateAction, LoseFateProperties } from './LoseFateAction.js';
import { LoseHonorAction, LoseHonorProperties } from './LoseHonorAction.js';
import { OptionalAction, OptionalActionProperties } from './OptionalAction.js';
import { MatchingDiscardAction, MatchingDiscardProperties } from './MatchingDiscardAction.js';
import { MenuPromptAction, MenuPromptProperties } from './MenuPromptAction.js';
import { ModifyBidAction, ModifyBidProperties } from './ModifyBidAction.js';
import { MoveCardAction, MoveCardProperties } from './MoveCardAction.js';
import { MoveConflictAction, MoveConflictProperties } from './MoveConflictAction.js';
import { MoveToConflictAction, MoveToConflictProperties } from './MoveToConflictAction.js';
import { MoveTokenAction, MoveTokenProperties } from './MoveTokenAction.js';
import { MultipleContextActionProperties, MultipleContextGameAction } from './MultipleContextGameAction.js';
import { MultipleGameAction } from './MultipleGameAction.js';
import { OpponentPutIntoPlayAction, OpponentPutIntoPlayProperties } from './OpponentPutIntoPlayAction.js';
import { PlaceCardUnderneathAction, PlaceCardUnderneathProperties } from './PlaceCardUnderneathAction.js';
import { PlaceFateAction, PlaceFateProperties } from './PlaceFateAction.js';
import { PlaceFateAttachmentAction, PlaceFateAttachmentProperties } from './PlaceFateAttachmentAction.js';
import { PlaceFateRingAction, PlaceFateRingProperties } from './PlaceFateRingAction.js';
import { PlayCardAction, PlayCardProperties } from './PlayCardAction.js';
import { PutInProvinceAction, PutInProvinceProperties } from './PutInProvinceAction.js';
import { PutIntoPlayAction, PutIntoPlayProperties } from './PutIntoPlayAction.js';
import { RandomDiscardAction, RandomDiscardProperties } from './RandomDiscardAction.js';
import { ReadyAction, ReadyProperties } from './ReadyAction.js';
import { RefillFaceupAction, RefillFaceupProperties } from './RefillFaceupAction.js';
import { RemoveFateAction, RemoveFateProperties } from './RemoveFateAction.js';
import { RemoveFromGameAction, RemoveFromGameProperties } from './RemoveFromGameAction.js';
import { RemoveRingFromPlayAction, RemoveRingFromPlayProperties } from './RemoveRingFromPlayAction.js';
import { ResolveAbilityAction, ResolveAbilityProperties } from './ResolveAbilityAction.js';
import { ResolveConflictRingAction } from './ResolveConflictRingAction.js';
import { ResolveElementAction, ResolveElementProperties } from './ResolveElementAction.js';
import { RestoreProvinceAction, RestoreProvinceProperties } from './RestoreProvinceAction.js';
import { ReturnRingAction, ReturnRingProperties } from './ReturnRingAction.js';
import { ReturnRingToPlayAction, ReturnRingToPlayProperties } from './ReturnRingToPlayAction.js';
import { ReturnToDeckAction, ReturnToDeckProperties } from './ReturnToDeckAction.js';
import { ReturnToHandAction, ReturnToHandProperties } from './ReturnToHandAction.js';
import { RevealAction, RevealProperties } from './RevealAction.js';
import { RingActionProperties } from './RingAction.js';
import { SelectCardAction, SelectCardProperties } from './SelectCardAction.js';
import { SelectRingAction, SelectRingProperties } from './SelectRingActions.js';
import { SelectTokenAction, SelectTokenProperties } from './SelectTokenAction.js';
import { SendHomeAction, SendHomeProperties } from './SendHomeAction.js';
import { SequentialAction } from './SequentialAction.js';
import { SequentialContextAction, SequentialContextProperties } from './SequentialContextAction.js';
import { SetDialAction, SetDialProperties } from './SetDialAction.js';
import { ShuffleDeckAction, ShuffleDeckProperties } from './ShuffleDeckAction.js';
import { SwitchConflictElementAction, SwitchConflictElementProperties } from './SwitchConflictElementAction.js';
import { SwitchConflictTypeAction, SwitchConflictTypeProperties } from './SwitchConflictTypeAction.js';
import { TaintAction, TaintProperties } from './TaintAction.js';
import { TakeControlAction, TakeControlProperties } from './TakeControlAction.js';
import { TakeFateRingAction, TakeFateRingProperties } from './TakeFateRingAction.js';
import { TakeRingAction, TakeRingProperties } from './TakeRingAction.js';
import { TransferFateAction, TransferFateProperties } from './TransferFateAction.js';
import { TransferHonorAction, TransferHonorProperties } from './TransferHonorAction.js';
import { TriggerAbilityAction, TriggerAbilityProperties } from './TriggerAbilityAction.js';
import { TurnCardFacedownAction, TurnCardFacedownProperties } from './TurnCardFacedownAction.js';

type PropsFactory<Props, _Target = unknown> =
    Props | ((context: any) => Props);

//////////////
// CARD
//////////////
export function addToken<Target = unknown>(propertyFactory: PropsFactory<AddTokenProperties, NoInfer<Target>> = {}): GameAction {
    return new AddTokenAction(propertyFactory as ConstructorParameters<typeof AddTokenAction>[0]);
}
export function attach<Target = unknown>(propertyFactory: PropsFactory<AttachActionProperties, NoInfer<Target>> = {}): GameAction {
    return new AttachAction(propertyFactory as ConstructorParameters<typeof AttachAction>[0]);
}
export function attachToRing<Target = unknown>(propertyFactory: PropsFactory<AttachToRingActionProperties, NoInfer<Target>> = {}): GameAction {
    return new AttachToRingAction(propertyFactory as ConstructorParameters<typeof AttachToRingAction>[0]);
}
export function bow<Target = unknown>(propertyFactory: PropsFactory<BowActionProperties, NoInfer<Target>> = {}): CardGameAction {
    return new BowAction(propertyFactory as ConstructorParameters<typeof BowAction>[0]);
}
export function breakProvince<Target = unknown>(propertyFactory: PropsFactory<BreakProperties, NoInfer<Target>> = {}): CardGameAction {
    return new BreakAction(propertyFactory as ConstructorParameters<typeof BreakAction>[0]);
}
export function cardLastingEffect<Target = unknown>(propertyFactory: PropsFactory<LastingEffectCardProperties, NoInfer<Target>>): GameAction {
    return new LastingEffectCardAction(propertyFactory as ConstructorParameters<typeof LastingEffectCardAction>[0]);
}
export function claimImperialFavor<Target = unknown>(propertyFactory: PropsFactory<ClaimFavorProperties, NoInfer<Target>>): GameAction {
    return new ClaimFavorAction(propertyFactory as ConstructorParameters<typeof ClaimFavorAction>[0]);
}
export function createToken<Target = unknown>(propertyFactory: PropsFactory<CreateTokenProperties, NoInfer<Target>> = {}): GameAction {
    return new CreateTokenAction(propertyFactory as ConstructorParameters<typeof CreateTokenAction>[0]);
}
export function detach<Target = unknown>(propertyFactory: PropsFactory<DetachActionProperties, NoInfer<Target>> = {}): GameAction {
    return new DetachAction(propertyFactory as ConstructorParameters<typeof DetachAction>[0]);
}
export function discardCard<Target = unknown>(propertyFactory: PropsFactory<DiscardCardProperties, NoInfer<Target>> = {}): CardGameAction {
    return new DiscardCardAction(propertyFactory as ConstructorParameters<typeof DiscardCardAction>[0]);
}
export function discardFromPlay<Target = unknown>(propertyFactory: PropsFactory<DiscardFromPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new DiscardFromPlayAction(propertyFactory as ConstructorParameters<typeof DiscardFromPlayAction>[0]);
}
export function dishonor<Target = unknown>(propertyFactory: PropsFactory<DishonorProperties, NoInfer<Target>> = {}): CardGameAction {
    return new DishonorAction(propertyFactory as ConstructorParameters<typeof DishonorAction>[0]);
}
export function dishonorProvince<Target = unknown>(propertyFactory: PropsFactory<DishonorProvinceProperties, NoInfer<Target>> = {}): GameAction {
    return new DishonorProvinceAction(propertyFactory as ConstructorParameters<typeof DishonorProvinceAction>[0]);
}
export function duel<Target = unknown>(propertyFactory: PropsFactory<DuelProperties, NoInfer<Target>>): GameAction {
    return new DuelAction(propertyFactory as ConstructorParameters<typeof DuelAction>[0]);
}
export function duelAddParticipant<Target = unknown>(propertyFactory: PropsFactory<DuelAddParticipantProperties, NoInfer<Target>>): GameAction {
    return new DuelAddParticipantAction(propertyFactory as ConstructorParameters<typeof DuelAddParticipantAction>[0]);
}
export function flipDynasty<Target = unknown>(propertyFactory: PropsFactory<FlipDynastyProperties, NoInfer<Target>> = {}): GameAction {
    return new FlipDynastyAction(propertyFactory as ConstructorParameters<typeof FlipDynastyAction>[0]);
}
export function flipImperialFavor<Target = unknown>(propertyFactory: PropsFactory<FlipFavorProperties, NoInfer<Target>>): GameAction {
    return new FlipFavorAction(propertyFactory as ConstructorParameters<typeof FlipFavorAction>[0]);
}
export function honor<Target = unknown>(propertyFactory: PropsFactory<HonorProperties, NoInfer<Target>> = {}): GameAction {
    return new HonorAction(propertyFactory as ConstructorParameters<typeof HonorAction>[0]);
}
export function injure<Target = unknown>(propertyFactory: PropsFactory<InjureActionProperties, NoInfer<Target>> = {}): GameAction {
    return new InjureAction(propertyFactory as ConstructorParameters<typeof InjureAction>[0]);
}

export function lookAt<Target = unknown>(propertyFactory: PropsFactory<LookAtProperties, NoInfer<Target>> = {}): GameAction {
    return new LookAtAction(propertyFactory as ConstructorParameters<typeof LookAtAction>[0]);
}
/**
 * default switch = false
 * default shuffle = false
 * default faceup = false
 */
export function moveCard<Target = unknown>(propertyFactory: PropsFactory<MoveCardProperties, NoInfer<Target>>): CardGameAction {
    return new MoveCardAction(propertyFactory as ConstructorParameters<typeof MoveCardAction>[0]);
}
export function moveToConflict<Target = unknown>(propertyFactory: PropsFactory<MoveToConflictProperties, NoInfer<Target>> = {}): CardGameAction {
    return new MoveToConflictAction(propertyFactory as ConstructorParameters<typeof MoveToConflictAction>[0]);
}
/**
 * default amount = 1
 */
export function placeFate<Target = unknown>(propertyFactory: PropsFactory<PlaceFateProperties, NoInfer<Target>> = {}): GameAction {
    return new PlaceFateAction(propertyFactory as ConstructorParameters<typeof PlaceFateAction>[0]);
}
/**
 * default amount = 1
 */
export function placeFateAttachment<Target = unknown>(propertyFactory: PropsFactory<PlaceFateAttachmentProperties, NoInfer<Target>> = {}): GameAction {
    return new PlaceFateAttachmentAction(propertyFactory as ConstructorParameters<typeof PlaceFateAttachmentAction>[0]);
}
/**
 * default resetOnCancel = false
 */
export function playCard<Target = unknown>(propertyFactory: PropsFactory<PlayCardProperties, NoInfer<Target>> = {}): GameAction {
    return new PlayCardAction(propertyFactory as ConstructorParameters<typeof PlayCardAction>[0]);
}
export function performGloryCount<Target = unknown>(propertyFactory: PropsFactory<GloryCountProperties, NoInfer<Target>>): GameAction {
    return new GloryCountAction(propertyFactory as ConstructorParameters<typeof GloryCountAction>[0]);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoConflict<Target = unknown>(propertyFactory: PropsFactory<PutIntoPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new PutIntoPlayAction(propertyFactory as ConstructorParameters<typeof PutIntoPlayAction>[0]);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function putIntoPlay<Target = unknown>(propertyFactory: PropsFactory<PutIntoPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new PutIntoPlayAction(propertyFactory as ConstructorParameters<typeof PutIntoPlayAction>[0], false);
}
export function putIntoProvince<Target = unknown>(propertyFactory: PropsFactory<PutInProvinceProperties, NoInfer<Target>>): GameAction {
    return new PutInProvinceAction(propertyFactory as ConstructorParameters<typeof PutInProvinceAction>[0]);
}
/**
 * default fate = 0
 * default status = ordinary
 */
export function opponentPutIntoPlay<Target = unknown>(propertyFactory: PropsFactory<OpponentPutIntoPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new OpponentPutIntoPlayAction(propertyFactory as ConstructorParameters<typeof OpponentPutIntoPlayAction>[0], false);
}
export function ready<Target = unknown>(propertyFactory: PropsFactory<ReadyProperties, NoInfer<Target>> = {}): GameAction {
    return new ReadyAction(propertyFactory as ConstructorParameters<typeof ReadyAction>[0]);
}
/**
 * default amount = 1
 */
export function removeFate<Target = unknown>(propertyFactory: PropsFactory<RemoveFateProperties, NoInfer<Target>> = {}): CardGameAction {
    return new RemoveFateAction(propertyFactory as ConstructorParameters<typeof RemoveFateAction>[0]);
}
export function removeFromGame<Target = unknown>(propertyFactory: PropsFactory<RemoveFromGameProperties, NoInfer<Target>> = {}): CardGameAction {
    return new RemoveFromGameAction(propertyFactory as ConstructorParameters<typeof RemoveFromGameAction>[0]);
}
export function resolveAbility<Target = unknown>(propertyFactory: PropsFactory<ResolveAbilityProperties, NoInfer<Target>>): GameAction {
    return new ResolveAbilityAction(propertyFactory as ConstructorParameters<typeof ResolveAbilityAction>[0]);
}
export function restoreProvince<Target = unknown>(propertyFactory: PropsFactory<RestoreProvinceProperties, NoInfer<Target>> = {}): GameAction {
    return new RestoreProvinceAction(propertyFactory as ConstructorParameters<typeof RestoreProvinceAction>[0]);
}
/**
 * default bottom = false
 */
export function returnToDeck<Target = unknown>(propertyFactory: PropsFactory<ReturnToDeckProperties, NoInfer<Target>> = {}): CardGameAction {
    return new ReturnToDeckAction(propertyFactory as ConstructorParameters<typeof ReturnToDeckAction>[0]);
}
export function returnToHand<Target = unknown>(propertyFactory: PropsFactory<ReturnToHandProperties, NoInfer<Target>> = {}): CardGameAction {
    return new ReturnToHandAction(propertyFactory as ConstructorParameters<typeof ReturnToHandAction>[0]);
}
/**
 * default chatMessage = false
 */
export function reveal<Target = unknown>(propertyFactory: PropsFactory<RevealProperties, NoInfer<Target>> = {}): CardGameAction {
    return new RevealAction(propertyFactory as ConstructorParameters<typeof RevealAction>[0]);
}
export function sendHome<Target = unknown>(propertyFactory: PropsFactory<SendHomeProperties, NoInfer<Target>> = {}): GameAction {
    return new SendHomeAction(propertyFactory as ConstructorParameters<typeof SendHomeAction>[0]);
}
export function sacrifice<Target = unknown>(propertyFactory: PropsFactory<DiscardFromPlayProperties, NoInfer<Target>> = {}): CardGameAction {
    return new DiscardFromPlayAction(propertyFactory as ConstructorParameters<typeof DiscardFromPlayAction>[0], true);
}
export function taint<Target = unknown>(propertyFactory: PropsFactory<TaintProperties, NoInfer<Target>> = {}): CardGameAction {
    return new TaintAction(propertyFactory as ConstructorParameters<typeof TaintAction>[0]);
}
export function takeControl<Target = unknown>(propertyFactory: PropsFactory<TakeControlProperties, NoInfer<Target>> = {}): GameAction {
    return new TakeControlAction(propertyFactory as ConstructorParameters<typeof TakeControlAction>[0]);
}
export function triggerAbility<Target = unknown>(propertyFactory: PropsFactory<TriggerAbilityProperties, NoInfer<Target>>): GameAction {
    return new TriggerAbilityAction(propertyFactory as ConstructorParameters<typeof TriggerAbilityAction>[0]);
}
export function turnFacedown<Target = unknown>(propertyFactory: PropsFactory<TurnCardFacedownProperties, NoInfer<Target>> = {}): GameAction {
    return new TurnCardFacedownAction(propertyFactory as ConstructorParameters<typeof TurnCardFacedownAction>[0]);
}
export function gainStatusToken<Target = unknown>(propertyFactory: PropsFactory<GainStatusTokenProperties, NoInfer<Target>> = {}): GameAction {
    return new GainStatusTokenAction(propertyFactory as ConstructorParameters<typeof GainStatusTokenAction>[0]);
}
export function moveConflict<Target = unknown>(propertyFactory: PropsFactory<MoveConflictProperties, NoInfer<Target>> = {}): GameAction {
    return new MoveConflictAction(propertyFactory as ConstructorParameters<typeof MoveConflictAction>[0]);
}
/**
 * default hideWhenFaceup = true
 */
export function placeCardUnderneath<Target = unknown>(propertyFactory: PropsFactory<PlaceCardUnderneathProperties, NoInfer<Target>>): GameAction {
    return new PlaceCardUnderneathAction(propertyFactory as ConstructorParameters<typeof PlaceCardUnderneathAction>[0]);
}

//////////////
// PLAYER
//////////////
/**
 * default amount = 1
 */
export function chosenDiscard<Target = unknown>(propertyFactory: PropsFactory<ChosenDiscardProperties, NoInfer<Target>> = {}): GameAction {
    return new ChosenDiscardAction(propertyFactory as ConstructorParameters<typeof ChosenDiscardAction>[0]);
}
/**
 * default amount = 1
 */
export function chosenReturnToDeck<Target = unknown>(propertyFactory: PropsFactory<ChosenReturnToDeckProperties, NoInfer<Target>> = {}): GameAction {
    return new ChosenReturnToDeckAction(propertyFactory as ConstructorParameters<typeof ChosenReturnToDeckAction>[0]);
}
/**
 * default amount = -1 (whole deck)
 * default reveal = true
 * default cardCondition = always true
 */
export function deckSearch<Target = unknown>(propertyFactory: PropsFactory<DeckSearchProperties, NoInfer<Target>>): GameAction {
    return new DeckSearchAction(propertyFactory as ConstructorParameters<typeof DeckSearchAction>[0]);
}
/**
 * default amount = 1
 */
export function discardAtRandom<Target = unknown>(propertyFactory: PropsFactory<RandomDiscardProperties, NoInfer<Target>> = {}): GameAction {
    return new RandomDiscardAction(propertyFactory as ConstructorParameters<typeof RandomDiscardAction>[0]);
}
/**
 * default amount = 1
 */
export function discardMatching<Target = unknown>(propertyFactory: PropsFactory<MatchingDiscardProperties, NoInfer<Target>> = {}): GameAction {
    return new MatchingDiscardAction(propertyFactory as ConstructorParameters<typeof MatchingDiscardAction>[0]);
}
/**
 * default amount = 1
 */
export function draw<Target = unknown>(propertyFactory: PropsFactory<DrawProperties, NoInfer<Target>> = {}): GameAction {
    return new DrawAction(propertyFactory as ConstructorParameters<typeof DrawAction>[0]);
}
/**
 * default amount = 1
 * default faceup = false
 */
export function fillProvince<Target = unknown>(propertyFactory: PropsFactory<FillProvinceProperties, NoInfer<Target>>): GameAction {
    return new FillProvinceAction(propertyFactory as ConstructorParameters<typeof FillProvinceAction>[0]);
}
export function gainFate<Target = unknown>(propertyFactory: PropsFactory<GainFateProperties, NoInfer<Target>> = {}): GameAction {
    return new GainFateAction(propertyFactory as ConstructorParameters<typeof GainFateAction>[0]);
} // amount = 1
export function gainHonor<Target = unknown>(propertyFactory: PropsFactory<GainHonorProperties, NoInfer<Target>> = {}): GameAction {
    return new GainHonorAction(propertyFactory as ConstructorParameters<typeof GainHonorAction>[0]);
} // amount = 1
/**
 * default giveHonor = false
 * default players = Players.Any
 * default prohibitedBids = All bids allowed
 */
export function honorBid<Target = unknown>(propertyFactory: PropsFactory<HonorBidProperties, NoInfer<Target>> = {}): GameAction {
    return new HonorBidAction(propertyFactory as ConstructorParameters<typeof HonorBidAction>[0]);
}
export function fateBid<Target = unknown>(propertyFactory: PropsFactory<FateBidProperties, NoInfer<Target>> = {}): GameAction {
    return new FateBidAction(propertyFactory as ConstructorParameters<typeof FateBidAction>[0]);
}
export function initiateConflict<Target = unknown>(propertyFactory: PropsFactory<InitiateConflictProperties, NoInfer<Target>> = {}): GameAction {
    return new InitiateConflictAction(propertyFactory as ConstructorParameters<typeof InitiateConflictAction>[0]);
} // canPass = true
export function loseFate<Target = unknown>(propertyFactory: PropsFactory<LoseFateProperties, NoInfer<Target>> = {}): GameAction {
    return new LoseFateAction(propertyFactory as ConstructorParameters<typeof LoseFateAction>[0]);
}
export function loseHonor<Target = unknown>(propertyFactory: PropsFactory<LoseHonorProperties, NoInfer<Target>> = {}): GameAction {
    return new LoseHonorAction(propertyFactory as ConstructorParameters<typeof LoseHonorAction>[0]);
} // amount = 1
export function loseImperialFavor<Target = unknown>(propertyFactory: PropsFactory<DiscardFavorProperties, NoInfer<Target>> = {}): GameAction {
    return new DiscardFavorAction(propertyFactory as ConstructorParameters<typeof DiscardFavorAction>[0]);
}
export function modifyBid<Target = unknown>(propertyFactory: PropsFactory<ModifyBidProperties, NoInfer<Target>> = {}): GameAction {
    return new ModifyBidAction(propertyFactory as ConstructorParameters<typeof ModifyBidAction>[0]);
} // amount = 1, direction = 'increast', promptPlayer = false
export function playerLastingEffect<Target = unknown>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>>): GameAction {
    return new LastingEffectAction(propertyFactory as ConstructorParameters<typeof LastingEffectAction>[0]);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function refillFaceup<Target = unknown>(propertyFactory: PropsFactory<RefillFaceupProperties, NoInfer<Target>>): GameAction {
    return new RefillFaceupAction(propertyFactory as ConstructorParameters<typeof RefillFaceupAction>[0]);
} // location
export function setHonorDial<Target = unknown>(propertyFactory: PropsFactory<SetDialProperties, NoInfer<Target>>): GameAction {
    return new SetDialAction(propertyFactory as ConstructorParameters<typeof SetDialAction>[0]);
} // value
export function shuffleDeck<Target = unknown>(propertyFactory: PropsFactory<ShuffleDeckProperties, NoInfer<Target>>): GameAction {
    return new ShuffleDeckAction(propertyFactory as ConstructorParameters<typeof ShuffleDeckAction>[0]);
}
export function takeFate<Target = unknown>(propertyFactory: PropsFactory<TransferFateProperties, NoInfer<Target>> = {}): GameAction {
    return new TransferFateAction(propertyFactory as ConstructorParameters<typeof TransferFateAction>[0]);
} // amount = 1
export function takeHonor<Target = unknown>(propertyFactory: PropsFactory<TransferHonorProperties, NoInfer<Target>> = {}): GameAction {
    return new TransferHonorAction(propertyFactory as ConstructorParameters<typeof TransferHonorAction>[0]);
} // amount = 1

//////////////
// RING
//////////////
export function placeFateOnRing<Target = unknown>(propertyFactory: PropsFactory<PlaceFateRingProperties, NoInfer<Target>> = {}): GameAction {
    return new PlaceFateRingAction(propertyFactory as ConstructorParameters<typeof PlaceFateRingAction>[0]);
} // amount = 1, origin
export function resolveConflictRing<Target = unknown>(propertyFactory: PropsFactory<RingActionProperties, NoInfer<Target>> = {}): GameAction {
    return new ResolveConflictRingAction(propertyFactory as ConstructorParameters<typeof ResolveConflictRingAction>[0]);
} // resolveAsAttacker = true
export function resolveRingEffect<Target = unknown>(propertyFactory: PropsFactory<ResolveElementProperties, NoInfer<Target>> = {}): GameAction {
    return new ResolveElementAction(propertyFactory as ConstructorParameters<typeof ResolveElementAction>[0]);
} // options = false
export function returnRing<Target = unknown>(propertyFactory: PropsFactory<ReturnRingProperties, NoInfer<Target>> = {}): GameAction {
    return new ReturnRingAction(propertyFactory as ConstructorParameters<typeof ReturnRingAction>[0]);
}
export function ringLastingEffect<Target = unknown>(propertyFactory: PropsFactory<LastingEffectRingProperties, NoInfer<Target>>): GameAction {
    return new LastingEffectRingAction(propertyFactory as ConstructorParameters<typeof LastingEffectRingAction>[0]);
} // duration = 'untilEndOfConflict', effect, condition, until
export function selectRing<Target = unknown>(propertyFactory: PropsFactory<SelectRingProperties, NoInfer<Target>>): GameAction {
    return new SelectRingAction(propertyFactory as ConstructorParameters<typeof SelectRingAction>[0]);
}
export function switchConflictElement<Target = unknown>(propertyFactory: PropsFactory<SwitchConflictElementProperties, NoInfer<Target>> = {}): GameAction {
    return new SwitchConflictElementAction(propertyFactory as ConstructorParameters<typeof SwitchConflictElementAction>[0]);
}
export function switchConflictType<Target = unknown>(propertyFactory: PropsFactory<SwitchConflictTypeProperties, NoInfer<Target>> = {}): GameAction {
    return new SwitchConflictTypeAction(propertyFactory as ConstructorParameters<typeof SwitchConflictTypeAction>[0]);
}
export function takeFateFromRing<Target = unknown>(propertyFactory: PropsFactory<TakeFateRingProperties, NoInfer<Target>> = {}): GameAction {
    return new TakeFateRingAction(propertyFactory as ConstructorParameters<typeof TakeFateRingAction>[0]);
} // amount = 1
export function takeRing<Target = unknown>(propertyFactory: PropsFactory<TakeRingProperties, NoInfer<Target>> = {}): GameAction {
    return new TakeRingAction(propertyFactory as ConstructorParameters<typeof TakeRingAction>[0]);
}
export function claimRing<Target = unknown>(propertyFactory: PropsFactory<ClaimRingProperties, NoInfer<Target>> = {}): GameAction {
    return new ClaimRingAction(propertyFactory as ConstructorParameters<typeof ClaimRingAction>[0]);
}
export function removeRingFromPlay<Target = unknown>(propertyFactory: PropsFactory<RemoveRingFromPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new RemoveRingFromPlayAction(propertyFactory as ConstructorParameters<typeof RemoveRingFromPlayAction>[0]);
}
export function returnRingToPlay<Target = unknown>(propertyFactory: PropsFactory<ReturnRingToPlayProperties, NoInfer<Target>> = {}): GameAction {
    return new ReturnRingToPlayAction(propertyFactory as ConstructorParameters<typeof ReturnRingToPlayAction>[0]);
}

//////////////
// STATUS TOKEN
//////////////
export function discardStatusToken<Target = unknown>(propertyFactory: PropsFactory<DiscardStatusProperties, NoInfer<Target>> = {}): GameAction {
    return new DiscardStatusAction(propertyFactory as ConstructorParameters<typeof DiscardStatusAction>[0]);
}
export function moveStatusToken<Target = unknown>(propertyFactory: PropsFactory<MoveTokenProperties, NoInfer<Target>>): GameAction {
    return new MoveTokenAction(propertyFactory as ConstructorParameters<typeof MoveTokenAction>[0]);
}

//////////////
// GENERIC
//////////////
export function cancel<Target = unknown>(propertyFactory: PropsFactory<CancelActionProperties, NoInfer<Target>> = {}): GameAction {
    return new CancelAction(propertyFactory as ConstructorParameters<typeof CancelAction>[0]);
}
export function handler<Target = unknown>(propertyFactory: PropsFactory<HandlerProperties, NoInfer<Target>> = {}): GameAction {
    return new HandlerAction(propertyFactory as ConstructorParameters<typeof HandlerAction>[0]);
}
export function noAction(): GameAction {
    const action = new HandlerAction({});
    action.isNoAction = true;
    return action;
}

//////////////
// CONFLICT
//////////////
export function conflictLastingEffect<Target = unknown>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>>): GameAction {
    return new LastingEffectAction(propertyFactory as ConstructorParameters<typeof LastingEffectAction>[0]);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until
export function immediatelyResolveConflict(): GameAction {
    return new HandlerAction({});
}

//////////////
// DUEL
//////////////
export function duelLastingEffect<Target = unknown>(propertyFactory: PropsFactory<LastingEffectProperties, NoInfer<Target>>): GameAction {
    return new LastingEffectAction(propertyFactory as ConstructorParameters<typeof LastingEffectAction>[0]);
} // duration = 'untilEndOfConflict', effect, targetController, condition, until

//////////////
// META
//////////////
export function cardMenu<Target = unknown>(propertyFactory: PropsFactory<CardMenuProperties, NoInfer<Target>>): GameAction {
    return new CardMenuAction(propertyFactory as ConstructorParameters<typeof CardMenuAction>[0]);
}
export function chooseAction<Target = unknown>(propertyFactory: PropsFactory<ChooseActionProperties, NoInfer<Target>>): GameAction {
    return new ChooseGameAction(propertyFactory as ConstructorParameters<typeof ChooseGameAction>[0]);
} // choices, activePromptTitle = 'Select one'
export function conditional<Target = unknown>(propertyFactory: PropsFactory<ConditionalActionProperties, NoInfer<Target>>): GameAction {
    return new ConditionalAction(propertyFactory as ConstructorParameters<typeof ConditionalAction>[0]);
}
export function onAffinity<Target = unknown>(propertyFactory: PropsFactory<AffinityActionProperties, NoInfer<Target>>): GameAction {
    return new AffinityAction(propertyFactory as ConstructorParameters<typeof AffinityAction>[0]);
}
export function optional<Target = unknown>(propertyFactory: PropsFactory<OptionalActionProperties, NoInfer<Target>>): GameAction {
    return new OptionalAction(propertyFactory as ConstructorParameters<typeof OptionalAction>[0]);
}
export function ifAble<Target = unknown>(propertyFactory: PropsFactory<IfAbleActionProperties, NoInfer<Target>>): GameAction {
    return new IfAbleAction(propertyFactory as ConstructorParameters<typeof IfAbleAction>[0]);
}
export function injure2(): GameAction {
    return conditional({
        condition: (context) => (context.target as DrawCard).getFate() === 0,
        trueGameAction: discardFromPlay(),
        falseGameAction: removeFate()
    });
}
export function joint(gameActions: GameAction[]): GameAction {
    return new JointGameAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function jointContext<Target = unknown>(propertyFactory: PropsFactory<JointGameContextProperties, NoInfer<Target>>): GameAction {
    return new JointGameContextAction(propertyFactory as ConstructorParameters<typeof JointGameContextAction>[0]);
} // takes an array of gameActions, not a propertyFactory
export function multiple(gameActions: GameAction[]): GameAction {
    return new MultipleGameAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function multipleContext<Target = unknown>(propertyFactory: PropsFactory<MultipleContextActionProperties, NoInfer<Target>>): GameAction {
    return new MultipleContextGameAction(propertyFactory as ConstructorParameters<typeof MultipleContextGameAction>[0]);
}
export function menuPrompt<Target = unknown>(propertyFactory: PropsFactory<MenuPromptProperties, NoInfer<Target>>): GameAction {
    return new MenuPromptAction(propertyFactory as ConstructorParameters<typeof MenuPromptAction>[0]);
}
export function selectCard<Target = unknown>(propertyFactory: PropsFactory<SelectCardProperties, NoInfer<Target>>): GameAction {
    return new SelectCardAction(propertyFactory as ConstructorParameters<typeof SelectCardAction>[0]);
}
export function selectToken<Target = unknown>(propertyFactory: PropsFactory<SelectTokenProperties, NoInfer<Target>>): GameAction {
    return new SelectTokenAction(propertyFactory as ConstructorParameters<typeof SelectTokenAction>[0]);
}
export function sequential(gameActions: GameAction[]): GameAction {
    return new SequentialAction(gameActions);
} // takes an array of gameActions, not a propertyFactory
export function sequentialContext<Target = unknown>(propertyFactory: PropsFactory<SequentialContextProperties, NoInfer<Target>>): GameAction {
    return new SequentialContextAction(propertyFactory as ConstructorParameters<typeof SequentialContextAction>[0]);
}
