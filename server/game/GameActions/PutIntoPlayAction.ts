import AbilityContext = require('../AbilityContext');
import DrawCard = require('../drawcard');
import { CardGameAction, CardActionProperties } from './CardGameAction';
import { Locations, CardTypes, EventNames, Players }  from '../Constants';

export interface PutIntoPlayProperties extends CardActionProperties {
    fate?: number,
    status?: string,
    controller?: Players,
    side?: Players
}

export class PutIntoPlayAction extends CardGameAction {
    name = 'putIntoPlay';
    eventName = EventNames.OnCharacterEntersPlay;
    cost = 'putting {0} into play';
    targetType = [CardTypes.Character];
    intoConflict: boolean;
    defaultProperties: PutIntoPlayProperties = { 
        fate: 0,
        status: 'ordinary',
        controller: Players.Self,
        side: Players.Self
    };
    constructor(properties: ((context: AbilityContext) => PutIntoPlayProperties) | PutIntoPlayProperties, intoConflict = true) {
        super(properties);
        this.intoConflict = intoConflict;
    }

    getPutIntoPlayPlayer(context) {
        return context.player;
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['put {0} into play' + (this.intoConflict ? ' in the conflict' : ''), [target]];
    }

    canAffect(card: DrawCard, context: AbilityContext): boolean {
        let properties = this.getProperties(context) as PutIntoPlayProperties;
        let contextCopy = context.copy( { source: card });
        let player = this.getPutIntoPlayPlayer(contextCopy);
        let targetSide = contextCopy.player;
        if(properties.side === Players.Opponent) {
            targetSide = targetSide.opponent;
        }

        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!player || card.anotherUniqueInPlay(player)) {
            return false;
        } else if(card.location === Locations.PlayArea || card.facedown) {
            return false;
        } else if(!card.checkRestrictions('putIntoPlay', context)) {
            return false;
        } else if (!player.checkRestrictions('enterPlay', contextCopy)) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions('putIntoConflict', context)) {
                return false;
            }
            
            // its being put into play for its controller, & controller is attacking and character can't attack, or controller is defending and character can't defend
            if((targetSide.isAttackingPlayer() && !card.canParticipateAsAttacker()) ||
                (targetSide.isDefendingPlayer() && !card.canParticipateAsDefender())) {
                return false;
            }
        }
        return true;
    }

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { fate, status, controller, side } = this.getProperties(context, additionalProperties) as PutIntoPlayProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.fate = fate;
        event.status = status;
        event.controller = controller;
        event.intoConflict = this.intoConflict;
        event.originalLocation = card.location;
        event.side = side;   
    }

    eventHandler(event, additionalProperties = {}): void {
        let player = this.getPutIntoPlayPlayer(event.context);
        this.checkForRefillProvince(event.card, event, additionalProperties);
        event.card.new = true;
        if(event.fate) {
            event.card.fate = event.fate;
        }

        let finalController = event.context.player;
        if(event.controller === Players.Opponent) {
            finalController = finalController.opponent;
        }

        let targetSide = event.context.player;
        if(event.side === Players.Opponent) {
            targetSide = targetSide.opponent;
        }

        if(event.status === 'honored') {
            event.card.honor();
        } else if(event.status === 'dishonored') {
            event.card.dishonor();
        }

        player.moveCard(event.card, Locations.PlayArea);

        //moveCard sets all this stuff and only works if the owner is moving cards, so we're switching it around
        if (event.card.controller !== finalController) {
            event.card.controller = finalController;
            event.card.setDefaultController(event.card.controller);
            event.card.owner.cardsInPlay.splice(event.card.owner.cardsInPlay.indexOf(event.card), 1);
            event.card.controller.cardsInPlay.push(event.card);
        }

        if(event.intoConflict) {
            if(targetSide.isAttackingPlayer()) {
                event.context.game.currentConflict.addAttacker(event.card);
            } else {
                event.context.game.currentConflict.addDefender(event.card);
            }        
        }
    }
}
