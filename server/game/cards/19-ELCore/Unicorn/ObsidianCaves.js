const AbilityDsl = require('../../../abilitydsl');
const { Players, CardTypes } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class ObsidianCaves extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Opponent moves a character home',
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to send home',
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

ObsidianCaves.id = 'obsidian-caves';

module.exports = ObsidianCaves;
