const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, Locations, Players, CardTypes } = require('../../Constants');

class CardWrapper {
    constructor(card) {
        this.dynastyCard = card;
        this.targetLocation = null;
    }
}

class GovernorsSpy extends DrawCard {
    // dynastyCards = [];

    setupCardAbilities() {
        this.action({
            title: 'Flip a player\'s dynasty cards facedown and rearrange them',
            condition: context => context.source.isParticipating(),
            target: {
                mode: TargetModes.Select,
                targets: true,
                choices:  {
                    [this.owner.name]: AbilityDsl.actions.handler({
                        handler: context => this.governorHandler(context, this.owner)
                    }),
                    [this.owner.opponent && this.owner.opponent.name || 'NA']: AbilityDsl.actions.handler({
                        handler: context => this.governorHandler(context, this.owner.opponent)
                    })
                }
            },
            effect: 'to turn facedown and rearrange all of {1}\'s dynasty cards',
            effectArgs: context => context.select === this.owner.name ? this.owner : this.owner.opponent
        });
    }

    governorHandler(context, targetPlayer) {
        //Step 1: Find all dynasty cards for the player currently in provinces
        context.governorsSpyDataStore.dynastyCards = targetPlayer.getDynastyCardsInProvince(Locations.Provinces).map(card => new CardWrapper(card));
        this.dynastyCards.sort((a, b) => a.dynastyCard.name.localeCompare(b.dynastyCard.name));
        //Step 2: Flip them all face down and create a list that we'll end up using for their new location
        this.dynastyCards.forEach(card => {
            card.dynastyCard.facedown = true;
        })

        //Step 3: For each card, choose an eligible province.  This is done via prompt for select, which queues simple steps
        this.dynastyCards.forEach(card => {
            this.governorSelectPrompt(context, targetPlayer, card);
        })

        context.game.queueSimpleStep(() => this.governorMoveCards(context, targetPlayer));
    }

    governorSelectPrompt(context, targetPlayer, currentCard) {
        this.game.promptForSelect(context.player, {
            activePromptTitle: 'Choose a province for ' + currentCard.dynastyCard.name,
            context: context,
            location: Locations.Provinces,
            controller: targetPlayer === context.controller ? Players.Self : Players.Opponent,
            cardCondition: card => card.type === CardTypes.Province && this.isProvinceValidTarget(targetPlayer, this.dynastyCards, card),
            onSelect: (player, card) => {
                this.game.addMessage('{0} places a card', player);
                let location = card.location;
                currentCard.targetLocation = location;
                return true;
            }
        });
    }

    governorMoveCards(context, targetPlayer) {
        this.dynastyCards.forEach(card => {
            let newLocation = this.newLocations[card];
            targetPlayer.moveCard(card, newLocation);
        })
        this.game.addMessage('{0} has finished placing cards', context.player);
    }

    isProvinceValidTarget(targetPlayer, cards, province) {
        //Step 1: Identify empty provinces
        let emptyLocations = [];
        [Locations.ProvinceOne, Locations.ProvinceTwo, Locations.ProvinceThree, Locations.ProvinceFour].forEach(p => {
            if (!cards.some(card => card.targetLocation === p)) {
                emptyLocations.push(p);
            }
        })

        //Step 2: Identify how many cards we have left to place
        let location = province.location;
        let cardsLeft = cards.filter(a => !a.targetLocation).length;

        //Step 2.1: We have more cards than we have empty locations
        if (cardsLeft > emptyLocations.length) {
            return true;
        }

        //Step 2.2 We need to put the card in an empty location
        return emptyLocations.some(loc => loc === location);
    }
}

GovernorsSpy.id = 'governor-s-spy';

module.exports = GovernorsSpy;
