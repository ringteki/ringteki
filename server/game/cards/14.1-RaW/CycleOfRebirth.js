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
                cardCondition: card => card.type !== CardTypes.Province && card.type !== CardTypes.Stronghold
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.moveCard(context => ({
                    destination: Locations.DynastyDeck,
                    target: [context.target, context.source],
                    shuffle: true
                })),
                AbilityDsl.actions.refillFaceup(context => ({
                    target: [context.target.controller, context.source.controller],
                    location: [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour]
                }))
            ])
        });
    }
}

CycleOfRebirth.id = 'cycle-of-rebirth';

module.exports = CycleOfRebirth;

