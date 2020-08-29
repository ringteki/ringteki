const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');

class IkomaUjiaki extends DrawCard {
    setupCardAbilities(ability) {
        // TODO: refactor this
        this.action({
            title: 'Put 2 characters into play',
            cost: ability.costs.discardImperialFavor(),
            condition: context => context.source.isParticipating() && [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].some(location => {
                let cards = context.player.getDynastyCardsInProvince(location);
                return cards.some(card => card.isFacedown() || (card.type === CardTypes.Character && card.allowGameAction('putIntoConflict', context)));
            }),
            effect: 'to reveal all their facedown dynasty cards',
            handler: context => {
                let revealedCards = [];
                _.each([Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour], location => {
                    let cards = context.player.getDynastyCardsInProvince(location);
                    cards.forEach(card => {
                        if(card && card.isFacedown()) {
                            revealedCards.push(card);
                            card.facedown = false;
                        }
                    });
                });
                this.game.promptForSelect(context.player, {
                    mode: TargetModes.UpTo,
                    numCards: 2,
                    activePrompt: 'Choose up to 2 characters',
                    cardType: CardTypes.Character,
                    location: Locations.Provinces,
                    controller: Players.Self,
                    context: context,
                    optional: true,
                    cardCondition: card => card.isFaceup() && card.allowGameAction('putIntoConflict', context),
                    onSelect: (player, cards) => {
                        if(revealedCards.length > 0) {
                            this.game.addMessage('{0} reveals {1} and puts {2} into play', player, revealedCards, cards);
                        } else {
                            this.game.addMessage('{0} puts {1} into play', player, cards);
                        }
                        this.game.applyGameAction(context, { putIntoConflict: cards });
                        return true;
                    }
                });
            }
        });
    }
}

IkomaUjiaki.id = 'ikoma-ujiaki';

module.exports = IkomaUjiaki;
