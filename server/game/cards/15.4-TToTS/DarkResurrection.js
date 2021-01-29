const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class DarkResurrection extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Put characters into play from your discard',
            condition: () => this.game.isDuringConflict('military'),
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose up to three characters',
                numCards: 3,
                targets: true,
                mode: TargetModes.UpTo,
                optional: true,
                cardType: CardTypes.Character,
                location: [Locations.DynastyDiscardPile],
                controller: Players.Self,
                cardCondition: card => card.type === CardTypes.Character && card.printedCost <= 3 && card.allowGameAction('putIntoConflict', context),
                message: '{0} puts {1}{2}{3} into play into the conflict',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.putIntoConflict({ status: 'dishonored' })
            }))
        });
    }

    isTemptationsMaho() {
        return true;
    }
}

DarkResurrection.id = 'dark-resurrection';

module.exports = DarkResurrection;

