const DrawCard = require('../../../drawcard.js');
const { CardTypes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class ChildOfSaltlessWater extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition:  context => !context.source.isParticipating(),
                message: '{0} is discarded from play as it is not participating in a conflict',
                messageArgs: context => [context.source],
                gameAction: AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.source
                }))
            })
        });

        this.action({
            title: 'Put into play',
            cost: AbilityDsl.costs.payFate(1),
            condition: context => context.game.isDuringConflict('military'),
            location: Locations.Hand,
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: card => card.isConflictProvince()
            },
            effect: 'put {1} into play and set it to {2}{3}',
            effectArgs: context => [context.source, context.target.printedStrength, 'military'],
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoConflict(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    effect: AbilityDsl.effects.setMilitarySkill(context.target.printedStrength)
                }))
            ])
        });
    }
}

ChildOfSaltlessWater.id = 'child-of-saltless-water';

module.exports = ChildOfSaltlessWater;
