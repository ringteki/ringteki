import { AbilityTypes, CardTypes, Players } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class KagiNawa extends DrawCard {
    static id = 'kagi-nawa';

    setupCardAbilities() {
        this.whileAttached({
            match: (card: BaseCard) => card.hasTrait('shinobi'),
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Move a character to the conflict',
                condition: (context: TriggeredAbilityContext) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    activePromptTitle: 'Choose a character with printed cost 2 or lower to move in',
                    cardCondition: (card: BaseCard) => !card.isParticipating() && card.printedCost <= 2,
                    gameAction: AbilityDsl.actions.moveToConflict()
                },
                effect: 'hook {0} and drag them into the conflict'
            })
        });
    }
}
