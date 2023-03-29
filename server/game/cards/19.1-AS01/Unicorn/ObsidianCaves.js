const AbilityDsl = require('../../../abilitydsl');
const { Players, CardTypes } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class ObsidianCaves extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Attacker moves a character home',
            target: {
                cardType: CardTypes.Character,
                controller: context => context.player.isAttackingPlayer() ? Players.Self : Players.Opponent,
                player: context => context.player.isAttackingPlayer() ? Players.Self : Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

ObsidianCaves.id = 'obsidian-caves';

module.exports = ObsidianCaves;
