const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players, PlayTypes, CardTypes } = require('../../../Constants.js');

class DisloyalOathkeeper extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(player => {
                    return player === this.controller;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.reaction({
            title: 'Put card under this',
            when: {
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardTypes.Event &&
                context.source.controller.getSourceList(this.uuid).map(a => a).length === 0
            },
            gameAction: AbilityDsl.actions.placeCardUnderneath(context => ({
                target: context.event.card,
                hideWhenFaceup: true,
                destination: this
            }))
        });
    }
}

DisloyalOathkeeper.id = 'disloyal-oathkeeper';

module.exports = DisloyalOathkeeper;
