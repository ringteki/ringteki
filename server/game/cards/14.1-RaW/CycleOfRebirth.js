const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

const { Locations, Players, CardTypes } = require('../../Constants');

class CycleOfRebirth extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Shuffle this and target into deck',
            target: {
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: card => card.type !== CardTypes.Province
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.moveCard(context => ({
                    destination: Locations.DynastyDeck,
                    target: context.target,
                    shuffle: true
                })),
                AbilityDsl.actions.moveCard(context => ({
                    destination: Locations.DynastyDeck,
                    target: context.source,
                    shuffle: true
                })),
                AbilityDsl.actions.refillFaceup(context => {
                    console.log('target location reshuffle', context.target.location);
                    console.log('cycle location reshuffle', context.source.location);
                    return {
                        location: [context.target.location, context.source.location]
                    };
                })
            ])
        });
    }
}

CycleOfRebirth.id = 'cycle-of-rebirth';

module.exports = CycleOfRebirth;

