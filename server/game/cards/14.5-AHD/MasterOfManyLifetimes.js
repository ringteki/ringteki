const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../Constants');

class MasterOfManyLifetimes extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Return a character and attachments',
            when: {
                onCardLeavesPlay: (event, context) => {
                    return event.card.controller === context.player;
                }
            },
            target: {
                cardType: CardTypes.Province,
                controller: Players.Self,
                location: Locations.Provinces
            },
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.returnToHand(context => ({
                        target: context.event.card.attachments
                    })),
                    AbilityDsl.actions.moveCard({
                        target: context.event.card,
                        destination: context.target
                    })
                ])
            }))
        });
    }
}

MasterOfManyLifetimes.id = 'master-of-many-lifetimes';

module.exports = MasterOfManyLifetimes;
