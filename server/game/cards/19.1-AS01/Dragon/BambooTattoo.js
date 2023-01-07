const DrawCard = require('../../../drawcard.js');
const { Locations, Players, CardTypes } = require('../../../Constants');
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
                targetCondition: target => target.type === CardTypes.Character && target.printedCost <= 2,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardBowed: (event, context) => context.source.parent && context.source.parent.isParticipating() &&
                    event.card === context.source.parent && event.context.source.type !== 'ring'
            },
            gameAction: AbilityDsl.actions.ready(context => ({ target: context.source.parent }))
        });
    }
}

BambooTattoo.id = 'bamboo-tattoo';

module.exports = BambooTattoo;
