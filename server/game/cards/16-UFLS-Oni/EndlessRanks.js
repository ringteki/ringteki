const { Players, CardTypes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const BaseOni = require('./BaseOni.js');

class EndlessRanks extends BaseOni {
    setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Put a dynasty character on top of your deck',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                controller: Players.Self,
                cardType: CardTypes.Character,
                location: Locations.DynastyDiscardPile,
                gameAction: AbilityDsl.actions.moveCard(context => ({
                    target: context.target,
                    destination: Locations.DynastyDeck
                }))
            }
        });
    }
}

EndlessRanks.id = 'endless-ranks';

module.exports = EndlessRanks;
