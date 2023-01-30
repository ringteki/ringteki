const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Locations, TargetModes, Players, PlayTypes } = require('../../../Constants');
const PlayCharacterAction = require('../../../playcharacteraction.js');
const PlayDisguisedCharacterAction = require('../../../PlayDisguisedCharacterAction.js');

class UtakuTakekoPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, false, true);
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
class UtakuTakekoPlayDisguisedAction extends PlayDisguisedCharacterAction {
    constructor(card) {
        super(card, false, true);
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

class UtakuTakeko extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Play character from your discard pile',
            target: {
                location: Locations.DynastyDiscardPile,
                mode: TargetModes.Single,
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.glory >= 1 && card.isFaction('unicorn') && !card.isUnique(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        effect: [
                            AbilityDsl.effects.gainPlayAction(UtakuTakekoPlayAction),
                            AbilityDsl.effects.gainPlayAction(UtakuTakekoPlayDisguisedAction)
                        ]
                    })),
                    AbilityDsl.actions.playCard(context => ({
                        target: context.target
                    }))
                ])
            }
        });
    }
}

UtakuTakeko.id = 'utaku-takeko';

module.exports = UtakuTakeko;
