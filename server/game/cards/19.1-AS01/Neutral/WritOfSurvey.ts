import AbilityContext = require('../../../AbilityContext');
import { AbilityTypes, CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class WritOfSurvey extends DrawCard {
    static id = 'writ-of-survey';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 }
        });

        this.persistentEffect({
            condition: (context) => context.source.parent.isHonored,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Bow a participating dishonored character',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    mode: TargetModes.Single,
                    cardCondition: (card: BaseCard) => card.isParticipating() && card.isDishonored,
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }

    public canPlayOn(source: BaseCard): boolean {
        return source.isHonored && super.canPlayOn(source);
    }
}
