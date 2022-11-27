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
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
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
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class ToConnectThePeople extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => !context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                location: [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile],
                cardCondition: (card, context) => !card.isUnique() && context.player.cardsInPlay.some(cardInPlay => cardInPlay.glory >= card.glory),
                mode: TargetModes.Single,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        effect: [
                            AbilityDsl.effects.gainPlayAction(ConnectThePeoplePlayAction),
                            AbilityDsl.effects.gainPlayAction(ConnectThePeoplePlayDisguisedAction)
                        ]
                    })),
                    AbilityDsl.actions.playCard(context => ({
                        target: context.target,
                        ignoredRequirements: ['location']
                    }))
                ])
            }
        });
    }
}

ToConnectThePeople.id = 'to-connect-the-people';

module.exports = ToConnectThePeople;
