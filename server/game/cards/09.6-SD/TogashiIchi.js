const { Locations, CardTypes } = require('../../Constants');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class TogashiIchi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Break the province',
            condition: context => context.source.isAttacking() &&
                (this.game.currentConflict.getNumberOfCardsPlayed(context.player) + this.game.currentConflict.getNumberOfCardsPlayed(context.player.opponent)) >= 10,
            effect: 'break an attacked province',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince() && card.location !== Locations.StrongholdProvince,
                message: '{0} breaks {1}',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.break()
            }))
        });
    }
}

TogashiIchi.id = 'togashi-ichi';

module.exports = TogashiIchi;
