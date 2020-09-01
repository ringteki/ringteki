const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../Constants');

class MasterOfManyLifetimes extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Return a character and attachments',
            when: {
                onCardLeavesPlay: (event, context) => {
                    return event.card.controller === context.player && event.card.type === CardTypes.Character;
                }
            },
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: card => card.facedown
            },
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand(context => ({
                        target: context.event.card.attachments.toArray()
                    })),
                    AbilityDsl.actions.putIntoProvince({
                        target: context.event.card,
                        canBeStronghold: true,
                        destination: context.target.location
                    })
                ])
            }))
        });
    }
}

MasterOfManyLifetimes.id = 'master-of-many-lifetimes';

module.exports = MasterOfManyLifetimes;
