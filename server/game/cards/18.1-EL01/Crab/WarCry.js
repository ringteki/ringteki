const DrawCard = require('../../../drawcard.js');
const { CardTypes, Locations, ConflictTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class WarCry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Break the attacked province',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player
                    && this.areAllAttackersBerserker(event.conflict)
                    && event.conflict.attackingPlayer === context.player
                    && event.conflict.conflictType === ConflictTypes.Military
            },
            effect: '{1}',
            effectArgs: context => this.isConflictNotAtStronghold(context) ? ['break an attacked province'] : ['draw a card'],
            gameAction: AbilityDsl.actions.ifAble(context => ({
                ifAbleAction: AbilityDsl.actions.selectCard(() => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    cardCondition: card => card.isConflictProvince() && card.location !== Locations.StrongholdProvince,
                    message: '{0} breaks {1}',
                    messageArgs: cards => [context.player, cards],
                    gameAction: AbilityDsl.actions.break()
                })),
                otherwiseAction: AbilityDsl.actions.draw({ target: context.player, amount: 1 })
            }))
        });
    }

    isConflictNotAtStronghold(context) {
        return context.game.currentConflict.getConflictProvinces().some(a => a.location !== Locations.StrongholdProvince);
    }

    areAllAttackersBerserker(conflict) {
        return conflict.attackers.every(a => a.hasTrait('berserker'));
    }
}

WarCry.id = 'war-cry';

module.exports = WarCry;
