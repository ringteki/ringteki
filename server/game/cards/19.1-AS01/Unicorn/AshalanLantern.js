const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { PlayTypes, Durations } = require('../../../Constants.js');

class AshalanLantern extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'shugenja',
            myControl: true
        });

        this.action({
            title: 'Place fate on card',
            cost: AbilityDsl.costs.sacrificeSelf(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Durations.UntilPassPriority,
                    targetController: context.player,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(3)
                })),
                AbilityDsl.actions.deckSearch({
                    amount: 3,
                    activePromptTitle: 'Choose a card to play',
                    gameAction: AbilityDsl.actions.playCard({
                        resetOnCancel: true,
                        source: this,
                        playType: PlayTypes.PlayFromHand
                    })
                })
            ]),
            effect: 'play a card from their conflict deck'
        });
    }
}
AshalanLantern.id = 'ashalan-lantern';

module.exports = AshalanLantern;
