const DrawCard = require('../../../drawcard.js');
const { CardTypes, Locations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class CeremonialRobes extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place a card from your deck faceup on a province',
            effect: 'look at the top 3 cards of their dynasty deck',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                controller: Players.Self
            },
            handler: (context) => {
                let top3Cards = context.player.dynastyDeck.first(3);
                let steps = [
                    {
                        activePromptTitle:
                            'Select a card to put on the bottom of the deck',
                        message: '{0} places a card on the bottom of the deck',
                        callback: (chosenCard) =>
                            context.player.moveCard(
                                chosenCard,
                                'dynasty deck bottom'
                            )
                    },
                    {
                        activePromptTitle:
                            'Select a card to put into the province faceup',
                        message: '{0} places {1} into {2}',
                        callback: (chosenCard) => {
                            context.player.moveCard(
                                chosenCard,
                                context.target.location
                            );
                            chosenCard.facedown = false;
                        }
                    },
                    {
                        activePromptTitle: 'Select a card to discard',
                        message: '{0} discards {1}',
                        callback: (chosenCard) => {
                            context.player.moveCard(
                                chosenCard,
                                Locations.DynastyDiscardPile
                            );
                            if(chosenCard.hasTrait('spirit')) {
                                this.game.addMessage(
                                    '{0} was a Spirit! {1} and {2} lose 1 honor',
                                    chosenCard,
                                    context.player,
                                    context.player.opponent
                                );
                                AbilityDsl.actions
                                    .loseHonor((context) => ({
                                        target: context.game.getPlayers()
                                    }))
                                    .resolve(chosenCard, context);
                            }
                        }
                    }
                ];

                this.ceremonialRobesPrompt(steps, context, top3Cards);
            }
        });
    }

    ceremonialRobesPrompt(remainingSteps, context, selectableCards) {
        let currentStep = remainingSteps.shift();
        if(!currentStep) {
            return;
        }
        if(selectableCards.length === 0) {
            return;
        }
        if(selectableCards.length === 1) {
            let lastCard = selectableCards[0];
            this.game.addMessage(
                currentStep.message,
                context.player,
                lastCard,
                context.target
            );
            currentStep.callback(lastCard);
            return;
        }

        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: currentStep.activePromptTitle,
            context: context,
            cards: selectableCards,
            cardHandler: (selectedCard) => {
                this.game.addMessage(
                    currentStep.message,
                    context.player,
                    selectedCard,
                    context.target
                );
                currentStep.callback(selectedCard);

                let newSelectableCards = selectableCards.filter(
                    (c) => c !== selectedCard
                );
                this.ceremonialRobesPrompt(
                    remainingSteps,
                    context,
                    newSelectableCards
                );
            }
        });
    }
}

CeremonialRobes.id = 'ceremonial-robes';

module.exports = CeremonialRobes;
