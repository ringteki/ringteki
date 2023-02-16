const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { AbilityTypes, CardTypes, Players } = require('../../../Constants.js');

class KagiNawa extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            match: (card) => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Move a character to the conflict',
                condition: (context) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    activePromptTitle: 'Choose a character with printed cost 2 or lower to move in',
                    cardCondition: (card) => !card.isParticipating() && card.printedCost <= 2,
                    gameAction: AbilityDsl.actions.moveToConflict()
                },
                effect: 'hook {0} and drag them into the conflict'
            })
        });
    }
}

KagiNawa.id = 'kagi-nawa';

module.exports = KagiNawa;
