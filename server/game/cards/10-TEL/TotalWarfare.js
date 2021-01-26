import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');
const BattlefieldAttachment = require('../BattlefieldAttachment');

class TotalWarfare extends BattlefieldAttachment {
    setupCardAbilities() {
        super.setupCardAbilities();

        this.forcedReaction({
            title: 'Loser sacrifices a character',
            when: {
                afterConflict: (event, context) => event.conflict.loser && context.source.parent.isConflictProvince()
            },
            target: {
                cardType: CardTypes.Character,
                player: context => context.source.controller === this.game.currentConflict.loser ? Players.Self : Players.Opponent,
                cardCondition: card => card.isParticipating() && card.controller === this.game.currentConflict.loser,
                gameAction: AbilityDsl.actions.sacrifice()
            }
        });
    }
}

TotalWarfare.id = 'total-warfare';

module.exports = TotalWarfare;

