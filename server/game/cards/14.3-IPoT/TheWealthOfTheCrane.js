const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations } = require('../../Constants');

class TheWealthOfTheCrane extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: (card, player) => {
                    return player.getNumberOfFaceupProvinces();
                },
                match: (card, source) => card === source
            })
        });

        this.action({
            title: 'Look at your dynasty deck',
            effect: 'look at the top ten cards of their dynasty deck',
            condition: context => context.player.dynastyDeck.size() > 0,
            max: AbilityDsl.limit.perPhase(1),
            handler: context => {
                let cards = context.player.dynastyDeck.first(10);
                this.resolveWealth(context, cards, Locations.ProvinceOne);
            }
        });
    }

    resolveWealth(context, cards, targetLocation) {
        if(!cards || cards.length <= 0 || !targetLocation) {
            context.player.shuffleDynastyDeck();
            return;
        }
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose a card to put into ' + context.player.getProvinceCardInProvince(targetLocation).name,
            context: context,
            cards: cards,
            choices: cards.length < this.getRemainingLocations(targetLocation) ? ['Put nothing in this province'] : [],
            handlers: [() => {
                this.resolveWealth(context, cards, this.getNextLocation(targetLocation));
                return true;
            }],
            cardHandler: cardFromDeck => {
                let province = context.player.getProvinceCardInProvince(targetLocation);
                context.player.moveCard(cardFromDeck, targetLocation);
                cardFromDeck.facedown = false;
                this.game.addMessage('{0} puts {1} into {2}', context.player, cardFromDeck.name, province.isFacedown() ? 'a facedown province' : province.name);

                cards = cards.filter(a => a !== cardFromDeck);
                this.resolveWealth(context, cards, this.getNextLocation(targetLocation));
            }
        });
    }

    getRemainingLocations(targetLocation) {
        if(targetLocation === Locations.ProvinceOne) {
            return 4;
        }
        if(targetLocation === Locations.ProvinceTwo) {
            return 3;
        }
        if(targetLocation === Locations.ProvinceThree) {
            return 2;
        }
        if(targetLocation === Locations.ProvinceFour) {
            return 1;
        }
        return 0;
    }

    getNextLocation(targetLocation) {
        if(targetLocation === Locations.ProvinceOne) {
            return Locations.ProvinceTwo;
        }
        if(targetLocation === Locations.ProvinceTwo) {
            return Locations.ProvinceThree;
        }
        if(targetLocation === Locations.ProvinceThree) {
            return Locations.ProvinceFour;
        }
        return null;
    }
}

TheWealthOfTheCrane.id = 'the-wealth-of-the-crane';

module.exports = TheWealthOfTheCrane;

