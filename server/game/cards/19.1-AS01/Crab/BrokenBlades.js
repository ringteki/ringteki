const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, ConflictTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class BrokenBlades extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Return all fate from a character then discard them',
            effect: 'ensure {0} is gone!{1}{2}{3}',
            effectArgs: (context) =>
                context.target.fate < 1
                    ? []
                    : [
                        ' (',
                        context.target.owner,
                        ' recovers ' + context.target.fate + ' fate)'
                    ],
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.player &&
                    event.conflict.conflictType === ConflictTypes.Military
            },

            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card) =>
                    card.isParticipating() && card.hasTrait('berserker')
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.removeFate((context) => ({
                        amount: context.target.getFate(),
                        recipient: context.target.owner
                    })),
                    AbilityDsl.actions.discardFromPlay()
                ])
            }
        });
    }
}

BrokenBlades.id = 'broken-blades';

module.exports = BrokenBlades;
