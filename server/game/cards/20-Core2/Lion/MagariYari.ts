import { AbilityTypes, CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MagariYari extends DrawCard {
    static id = 'magari-yari';

    setupCardAbilities() {
        this.whileAttached({
            match: (card: DrawCard) => card.hasTrait('bushi'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) =>
                        event.card.type === CardTypes.Character &&
                        event.card.isParticipating() &&
                        context.source.isParticipating() &&
                        context.game.isDuringConflict('military')
                },
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) =>
                        card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}
