const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const ProvinceCard = require('../../../provincecard.js');

class ForestOfRustlingWhispers extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            effect: 'honor or dishonor {0}',
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.chooseAction({
                    messages: {
                        'Honor this character': '{0} chooses to honor {1}',
                        'Dishonor this character': '{0} chooses to dishonor {1}'
                    },
                    choices: {
                        'Honor this character': AbilityDsl.actions.honor(),
                        'Dishonor this character': AbilityDsl.actions.dishonor()
                    }
                })
            }
        });
    }
}

ForestOfRustlingWhispers.id = 'forest-of-rustling-whispers';

module.exports = ForestOfRustlingWhispers;
