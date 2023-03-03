const DrawCard = require('../../../drawcard.js');
const { CardTypes, Locations, Players, Stages } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class BambooTattoo extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'monk'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.addTrait('tattooed')
        });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target) => target.type === CardTypes.Character && target.printedCost <= 3,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardBowed: (event, context) =>
                    context.source.parent &&
                    event.card === context.source.parent &&
                    event.context.source.type !== 'ring' &&
                    event.context.source.name !== 'Framework effect'
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready((context) => ({ target: context.source.parent })),
                AbilityDsl.actions.conditional({
                    condition: (context) => this._tattooUsedDuringCost(context),
                    trueGameAction: AbilityDsl.actions.dishonor((context) => ({ target: context.source.parent })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ]),
            effect: 'ready{2} {1}',
            effectArgs: (context) => [context.source.parent, this._tattooUsedDuringCost(context) ? ' and dishonor' : '']
        });
    }

    _tattooUsedDuringCost(context) {
        return context.event.context.stage === Stages.Cost;
    }
}

BambooTattoo.id = 'bamboo-tattoo';

module.exports = BambooTattoo;
