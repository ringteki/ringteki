import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type DrawCard from '../DrawCard.js';
import { CardType, Duration, EventName, Location } from '../Constants.js';
import Effects from '../effects.js';
import { type CardActionProperties, CardGameAction } from './CardGameAction.js';
import SpiritOfTheRiver from '../cards/SpiritOfTheRiver.js';
import type { GameEvent } from '../Events/EventPayloads.js';

export interface CreateTokenProperties extends CardActionProperties {
    atHome?: boolean;
    token: new (card: DrawCard) => DrawCard;
    leavingPlayMessage?: string;
    canEnterConflict: (type: 'military' | 'political') => boolean;
}

export class CreateTokenAction extends CardGameAction<CreateTokenProperties> {
    name = 'createToken';
    effect = 'create a token';
    eventName = EventName.OnCreateTokenCharacter;
    targetType = [CardType.Character, CardType.Holding, CardType.Event];
    defaultProperties: CreateTokenProperties = { atHome: false, token: SpiritOfTheRiver, canEnterConflict: () => true };

    canAffect(card: BaseCard, context: AbilityContext): boolean {
        let { canEnterConflict } = this.getProperties(context);

        if(!card.isFacedown() || !card.isInProvince() || card.location === Location.StrongholdProvince) {
            return false;
        } else if(context.game.isDuringConflict('military') && !canEnterConflict('military')) {
            return false;
        } else if(context.game.isDuringConflict('political') && !canEnterConflict('political')) {
            return false;
        }
        return super.canAffect(card, context);
    }

    eventHandler(event: GameEvent<EventName.OnCreateTokenCharacter>, additionalProperties: Record<string, unknown> = {}): void {
        let context = event.context as AbilityContext;
        let { atHome, token: propToken, leavingPlayMessage } = this.getProperties(context, additionalProperties);
        let card = event.card as DrawCard;
        let token = context.game.createToken(card, propToken);
        card.owner.removeCardFromPile(card);
        this.checkForRefillProvince(card, event, additionalProperties);
        card.moveTo(Location.RemovedFromGame);
        card.owner.moveCard(token, Location.PlayArea);
        const conflict = context.game.currentConflict;
        if(!atHome && conflict) {
            if(context.player.isAttackingPlayer()) {
                conflict.addAttacker(token);
            } else {
                conflict.addDefender(token);
            }
        }

        context.game.actions
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: Effects.delayedEffect({
                    when: {
                        onConflictFinished: () => true
                    },
                    message: leavingPlayMessage ?? '{0} returns to the deep',
                    messageArgs: [token],
                    gameAction: context.game.actions.discardFromPlay()
                })
            })
            .resolve(token, context);

        context.game.raiseEvent(EventName.OnCreateTokenCharacter, { tokenCharacter: token });
    }
}
