const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations, Players, TargetModes, PlayTypes } = require('../../../Constants.js');
const PlayCharacterAction = require('../../../playcharacteraction.js');
const PlayDisguisedCharacterAction = require('../../../PlayDisguisedCharacterAction.js');

class ConnectThePeoplePlayAction extends PlayCharacterAction {
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
class ConnectThePeoplePlayDisguisedAction extends PlayDisguisedCharacterAction {
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

class ToConnectThePeople extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a character from your opponent\'s discard pile',
            condition: (context) =>
                !context.game.isDuringConflict() &&
                context.player.cardsInPlay.any(
                    (card) => card.getType() === CardTypes.Character && card.hasTrait('merchant')
                ),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.discardCard((context) => ({
                    target: context.player.opponent && context.player.opponent.dynastyDeck.first(3)
                })),

                AbilityDsl.actions.selectCard({
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    location: [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile],
                    targets: true,
                    cardCondition: (card, context) =>
                        !card.isUnique() &&
                        context.player.cardsInPlay.some((cardInPlay) => cardInPlay.glory >= card.glory),
                    mode: TargetModes.Single,
                    gameAction: AbilityDsl.actions.sequential([
                        AbilityDsl.actions.cardLastingEffect({
                            effect: [
                                AbilityDsl.effects.gainPlayAction(ConnectThePeoplePlayAction),
                                AbilityDsl.effects.gainPlayAction(ConnectThePeoplePlayDisguisedAction)
                            ]
                        }),
                        AbilityDsl.actions.playCard({ ignoredRequirements: ['location'] })
                    ])
                })
            ])
        });
    }
}

ToConnectThePeople.id = 'to-connect-the-people';

module.exports = ToConnectThePeople;
