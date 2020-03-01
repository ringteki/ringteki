const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class ContemplativeWisdom extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility('action', {
                title: 'Give all abilities to another character',
                condition: context => context.game.isDuringConflict(),
                cost: AbilityDsl.costs.returnRings(1),
                target: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.gainAllAbilities(context.source)
                    }))
                },
                effect: 'give {0} all the printed abilities of {1}',
                effectArgs: context => [context.source],
                printedAbility: false
            })
        });
    }
}

ContemplativeWisdom.id = 'contemplative-wisdom';

module.exports = ContemplativeWisdom;
