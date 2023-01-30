const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players, TargetModes, Locations, PlayTypes } = require('../../../Constants.js');
const PlayCharacterAction = require('../../../playcharacteraction.js');
const PlayDisguisedCharacterAction = require('../../../PlayDisguisedCharacterAction.js');

class ToSowTheEarthPlayAction extends PlayCharacterAction {
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
class ToSowTheEarthPlayDisguisedAction extends PlayDisguisedCharacterAction {
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

class ToSowTheEarth extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play a peasant from the discard pile',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                location: [Locations.ConflictDiscardPile, Locations.DynastyDiscardPile],
                mode: TargetModes.Single,
                cardCondition: card => card.hasTrait('peasant'),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        effect: [
                            AbilityDsl.effects.gainPlayAction(ToSowTheEarthPlayAction),
                            AbilityDsl.effects.gainPlayAction(ToSowTheEarthPlayDisguisedAction)
                        ]
                    })),
                    AbilityDsl.actions.playCard(context => ({
                        target: context.target
                    }))
                ])
            },
            effect: 'play {0} from their discard pile'
        });

        this.action({
            title: 'Place a province facedown',
            cost: AbilityDsl.costs.bow({
                cardCondition: card => card.hasTrait('peasant')
            }),
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Any,
                cardCondition: card => card.isBroken === false,
                gameAction: AbilityDsl.actions.turnFacedown()
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

ToSowTheEarth.id = 'to-sow-the-earth';

module.exports = ToSowTheEarth;
