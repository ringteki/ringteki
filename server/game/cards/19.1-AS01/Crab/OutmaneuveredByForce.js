const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class OutmaneuveredByForce extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Declare a conflict right now',
            phase: Phases.Conflict,
            condition: (context) =>
                context.game
                    .getConflicts(Players.Any)
                    .filter((conflict) => conflict.declared).length === 0,

            gameAction: AbilityDsl.actions.initiateConflict({ canPass: false })
        });
    }

    canPlay(context, playType) {
        if(context.game.isDuringConflict()) {
            return false;
        }
        if(
            !context.player.cardsInPlay.any(
                (card) =>
                    card.getType() === CardTypes.Character &&
                    (card.hasTrait('berserker') || card.printedMilitarySkill >= 6)
            )
        ) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

OutmaneuveredByForce.id = 'outmaneuvered-by-force';

module.exports = OutmaneuveredByForce;
