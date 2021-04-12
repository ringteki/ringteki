const DrawCard = require('../../drawcard.js');
const { Elements, Players, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class StudentOfTheTao extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move in/out the conflict',
            condition: context => context.game.isDuringConflict() && context.game.currentConflict.getConflictProvinces().some(a => a.isElement(Elements.Void)),
            target: {
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

StudentOfTheTao.id = 'student-of-the-tao';

module.exports = StudentOfTheTao;
