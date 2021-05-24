import { Locations, CardTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MatsuTsuko2 extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Break the province',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller
                    && context.source.isAttacking()
                    && context.player.opponent && context.player.isMoreHonorable()
            },
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

MatsuTsuko2.id = 'matsu-tsuko-2';

module.exports = MatsuTsuko2;
