const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations } = require('../../../Constants.js');

class AshalanLantern extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place fate on card',
            when: {
                onCardAttached: (event, context) => (
                    context.source.parent && event.card === context.source && event.originalLocation !== Locations.PlayArea
                )
            },
            gameAction: AbilityDsl.actions.placeFateAttachment(context => ({
                target: context.source,
                amount: context.player.cardsInPlay.filter(card => card.hasTrait('shugenja')).length
            }))
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.alternateFatePool(card => {
                if(card.type === CardTypes.Event) {
                    return this;
                }
                return false;
            })
        });
    }
}

AshalanLantern.id = 'ashalan-lantern';

module.exports = AshalanLantern;
