const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { PlayTypes, Durations, CardTypes, Decks, Locations } = require('../../../Constants.js');
const PlayCharacterAction = require('../../../playcharacteraction.js');
const PlayDisguisedCharacterAction = require('../../../PlayDisguisedCharacterAction.js');

class AshalanLanternPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class AshalanLanternPlayDisguisedAction extends PlayDisguisedCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

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
                    reveal: true,
                    shuffle: false,
                    cardCondition: (card) => card.type === CardTypes.Character && !card.isUnique(),
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.cardLastingEffect({
                            effect: [
                                AbilityDsl.effects.gainPlayAction(AshalanLanternPlayAction),
                                AbilityDsl.effects.gainPlayAction(AshalanLanternPlayDisguisedAction)
                            ]
                        }),
                        AbilityDsl.actions.playCard({
                            ignoredRequirements: ['location'],
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
                        })
                    ])
                }))
            ]),
            effect: 'look for a character on the top of {1}\'s dynasty deck',
            effectArgs: (context) => [context.player.opponent]
        });
    }
}
AshalanLantern.id = 'ashalan-lantern';

module.exports = AshalanLantern;
