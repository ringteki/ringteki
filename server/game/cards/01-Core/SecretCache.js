const ProvinceCard = require('../../provincecard.js');
const { Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class SecretCache extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            effect: 'look at the top 5 cards of their conflict deck',
            gameAction: AbilityDsl.actions.deckSearch({
                amount: 5,
                reveal: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Locations.Hand
                })
            })
        });
    }
}

SecretCache.id = 'secret-cache';

module.exports = SecretCache;
