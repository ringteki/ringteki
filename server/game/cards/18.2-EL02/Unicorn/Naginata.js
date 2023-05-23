const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes } = require('../../../Constants.js');

class Naginata extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.whileAttached({
            condition: (context) => context.source.parent && context.source.controller.firstPlayer,
            effect: AbilityDsl.effects.modifyMilitarySkill(1)
        });

        this.reaction({
            title: 'Bow a character',
            when: {
                onMoveToConflict: (event, context) =>
                    context.source.parent &&
                    event.card.type === CardTypes.Character &&
                    event.card.isParticipating() &&
                    context.source.parent.isParticipating() &&
                    context.game.isDuringConflict('military'),
                onSendHome: (event, context) =>
                    context.source.parent &&
                    event.card.type === CardTypes.Character &&
                    !event.card.isParticipating() &&
                    context.source.parent.isParticipating() &&
                    context.game.isDuringConflict('military')
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card.getMilitarySkill() < context.source.parent.getMilitarySkill() && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

Naginata.id = 'naginata';

module.exports = Naginata;
