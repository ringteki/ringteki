import AbilityContext = require('../../../AbilityContext');
import { CardTypes, Phases, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class OutmaneuveredByForce extends DrawCard {
    static id = 'outmaneuvered-by-force';

    public setupCardAbilities() {
        this.action({
            title: 'Declare a conflict right now',
            phase: Phases.Conflict,
            condition: (context) =>
                context.game.getConflicts(Players.Any).filter((conflict) => conflict.declared).length === 0,

            gameAction: AbilityDsl.actions.initiateConflict({ canPass: false })
        });
    }

    public canPlay(context: AbilityContext, playType: string): boolean {
        return (
            !context.game.isDuringConflict() &&
            this.controlsBerserkerOrBigCharacter(context) &&
            super.canPlay(context, playType)
        );
    }

    private controlsBerserkerOrBigCharacter(context: AbilityContext): boolean {
        return context.player.cardsInPlay.any(
            (card: BaseCard) =>
                card.getType() === CardTypes.Character && (card.hasTrait('berserker') || card.printedMilitarySkill >= 6)
        );
    }
}
