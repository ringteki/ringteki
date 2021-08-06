const DrawCard = require('../../../drawcard.js');
const { Durations, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class WarOfWords extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Both players may always declare political conflicts',
            condition: context => context.game.isDuringConflict('military'),
            gameAction: AbilityDsl.actions.playerLastingEffect(() => ({
                duration: Durations.UntilEndOfConflict,
                targetController: Players.Self,
                effect: AbilityDsl.effects.changeConflictSkillFunctionPlayer(card => card.getPoliticalSkill())
            })),
            effect: 'count their political skill towards conflict resolution'
        });
    }
}

WarOfWords.id = 'war-of-words';

module.exports = WarOfWords;
