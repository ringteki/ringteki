import { AbilityTypes, CardTypes } from '../../../Constants.js';
const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class DaikyuReprint extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parent && context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Reaction, {
                title: 'Bow a character',
                when: {
                    onMoveToConflict: (event, context) => event.card.type === CardTypes.Character && event.card.isParticipating() &&
                        context.source.isParticipating() && context.game.isDuringConflict('military'),
                    onSendHome: (event, context) => event.card.type === CardTypes.Character && !event.card.isParticipating() &&
                        context.source.isParticipating() && context.game.isDuringConflict('military')
                },
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => card.getMilitarySkill() < context.source.getMilitarySkill() && card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}

DaikyuReprint.id = 'live-free-or-daikyu';

module.exports = DaikyuReprint;
