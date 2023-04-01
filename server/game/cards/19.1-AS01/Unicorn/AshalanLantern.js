const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Decks, Durations, Locations, PlayTypes } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');
const { PlayDynastyAsConflictCharacterAction, PlayDisguisedDynastyAsConflictCharacterAction } = require('../../../playdynastycharacterasconflictaction');

class AshalanLantern extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a character from your opponent\'s dynasty deck',
            condition: (context) => context.game.isDuringConflict(),
            cost: AbilityDsl.costs.nameCard(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.playerLastingEffect((context) => ({
                    duration: Durations.UntilPassPriority,
                    targetController: context.player,
                    effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                        3,
                        (card) => card.name === context.costs.nameCardCost
                    )
                })),
                AbilityDsl.actions.deckSearch((context) => ({
                    amount: 3,
                    deck: Decks.DynastyDeck,
                    player: context.player.opponent,
                    choosingPlayer: context.player,
                    shuffle: false,
                    cardCondition: (card) => card.type === CardTypes.Character && !card.isUnique(),
                    gameAction: AbilityDsl.actions.playCard(deckSearchContext => {
                        const target = deckSearchContext.targets[0];
                        return ({
                            target: target,
                            source: this,
                            resetOnCancel: false,
                            playType: PlayTypes.PlayFromHand,
                            playAction: target ? [
                                new PlayDynastyAsConflictCharacterAction(target, true),
                                new PlayDisguisedDynastyAsConflictCharacterAction(target, true)
                            ] : undefined,
                            ignoredRequirements: ['phase'],
                            postHandler: () => {
                                if(!context.source.parent.hasTrait('gaijin')) {
                                    context.game.addMessage(
                                        '{0} is not Foreign, their {1} is discarded',
                                        context.source.parent,
                                        context.source
                                    );
                                    context.player.moveCard(context.source, Locations.ConflictDiscardPile);
                                }
                            }
                        });
                    }),
                    remainingCardsHandler: (context, event, cards) => {
                        context.game.addMessage(
                            '{0} puts {1} on the top of {2}\' dynasty deck',
                            context.player,
                            cards,
                            context.player.opponent
                        );
                    },
                    message: '{0}{1}{2}{3}',
                    messageArgs: (context, selectedCards) => [
                        context.player,
                        selectedCards.length > 0 ? ' compels ' : ' takes nothing',
                        selectedCards,
                        selectedCards.length > 0 ? ' into service' : ''
                    ]
                }))
            ]),
            effect: 'look for a character on the top of {1}\'s dynasty deck. They reveal {2}',
            effectArgs: (context) => [context.player.opponent, context.player.opponent.dynastyDeck.first(3)]
        });
    }
}
AshalanLantern.id = 'ashalan-lantern';

module.exports = AshalanLantern;
