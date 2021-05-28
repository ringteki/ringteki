const { Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class FouleyesElite extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Bow a character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

FouleyesElite.id = 'fouleye-s-elite';

module.exports = FouleyesElite;
