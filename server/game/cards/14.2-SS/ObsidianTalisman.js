const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ObsidianTalisman extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard attached character\'s token',
            limit: AbilityDsl.limit.perRound(Infinity),
            cost: AbilityDsl.costs.payHonor(1),
            gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                target: context.source.parent.statusTokens[0]
            }))
        });
    }
}

ObsidianTalisman.id = 'obsidian-talisman';

module.exports = ObsidianTalisman;


