const { CardTypes } = require('../../Constants');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AsakoMaezawa2 extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Bow a character with no fate',
            when:{
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller && context.player.opponent
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.fate === 0,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.conditional({
                        condition: context => context.target.isFaction('phoenix'),
                        trueGameAction: AbilityDsl.actions.dishonor(),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 }) //do nothing
                    })
                ])
            },
            effect: 'bow {0}'
        });
    }
}

AsakoMaezawa2.id = 'asako-maezawa-2';

module.exports = AsakoMaezawa2;
