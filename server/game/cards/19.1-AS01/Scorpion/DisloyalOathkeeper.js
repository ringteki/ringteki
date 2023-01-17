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
                onCardPlayed: (event, context) => event.player === context.player.opponent && event.card.type === CardTypes.Event
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.handler({
                    handler: context => {
                        const cardsUnderneath = context.source.controller.getSourceList(this.uuid).map(a => a);
                        if(cardsUnderneath.length > 0) {
                            cardsUnderneath.forEach(card => {
                                card.owner.moveCard(card, Locations.ConflictDiscardPile);
                            });
                            this.game.addMessage('{0} {1} discarded from underneath {2}', cardsUnderneath, cardsUnderneath.length === 1 ? 'is' : 'are', this);
                        }
                    }
                }),
                AbilityDsl.actions.placeCardUnderneath(context => ({
                    target: context.event.card,
                    hideWhenFaceup: true,
                    destination: this
                }))
            ]),
            effect: 'place {1} underneath itself',
            effectArgs: context => [context.event.card]
        });
    }
}

DisloyalOathkeeper.id = 'disloyal-oathkeeper';

module.exports = DisloyalOathkeeper;
