import { CardGameAction, type CardActionProperties } from './CardGameAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { CardTypes, EventNames, Locations } from '../Constants';
import { Duel } from '../Duel';
import DrawCard = require('../drawcard');

export interface DuelAddParticipantProperties extends CardActionProperties {
    duel: Duel;
}

export class DuelAddParticipantAction extends CardGameAction {
    name = 'onAddDuelParticipant';
    eventName = EventNames.OnAddDuelParticipant;

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as DuelAddParticipantProperties;
        return ['extend the duel challenge to {0}', [properties.target]];
    }

    canAffect(card: DrawCard, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = this.getProperties(context, additionalProperties) as DuelAddParticipantProperties;

        if (card.type !== CardTypes.Character) {
            return false;
        }
        if (card.location !== Locations.PlayArea) {
            return false;
        }

        if (!card.allowGameAction('duel', context)) {
            return false;
        }

        return properties.duel.canAddToDuel(card, context);
    }

    addPropertiesToEvent(event, card: DrawCard, context: AbilityContext, additionalProperties): void {
        let { duel } = this.getProperties(context, additionalProperties) as DuelAddParticipantProperties;
        super.addPropertiesToEvent(event, card, context, additionalProperties);
        event.duel = duel;
    }

    eventHandler(event): void {
        event.duel.addTargetToDuel(event.card);
    }
}
