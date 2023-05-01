import { Locations } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class DaidojiAhma extends DrawCard {
    static id = 'daidoji-ahma';

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    event.context.ability.isTriggeredAbility() &&
                    event.cardTargets.some((card: BaseCard) => this.targetIsDishonoredCrane(card, context)),
                onMoveFate: (event, context) =>
                    this.isRingEffect(event) && event.fate > 0 && this.targetIsDishonoredCrane(event.origin, context),
                onCardHonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardDishonored: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardBowed: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context),
                onCardReadied: (event, context) =>
                    this.isRingEffect(event) && this.targetIsDishonoredCrane(event.card, context)
            },
            gameAction: AbilityDsl.actions.cancel(),
            effect: 'cancel the effects of {1}{2}',
            effectArgs: (context: TriggeredAbilityContext) => [
                context.event.context.source.type === 'ring' ? 'the ' : '',
                context.event.context.source
            ]
        });
    }

    private isRingEffect(event: any): boolean {
        return event.context.source.type === 'ring';
    }

    private targetIsDishonoredCrane(card: BaseCard, context: TriggeredAbilityContext): boolean {
        return (
            card.isDishonored &&
            card.controller === context.player &&
            card.location === Locations.PlayArea &&
            card.isFaction('crane')
        );
    }
}
