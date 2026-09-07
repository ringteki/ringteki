import { AbilityType, DuelType } from '../../../Constants.js';
import type { Duel } from '../../../Duel.js';
import type { GameAction } from '../../../GameActions/GameAction.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class JusticarsApproach2 extends DrawCard {
    static id = 'justicar-s-approach-evolved';

    setupCardAbilities() {
        this.attachmentConditions({ trait: ['courtier', 'magistrate'] });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityType.Action, {
                title: 'Initiate a duel to dishonor/bow/discard',
                printedAbility: false,
                initiateDuel: {
                    type: DuelType.Military,
                    gameAction: (duel: Duel) =>
                        AbilityDsl.actions.multiple(
                            duel.loser?.map((loserChar) => this.#effectsOnLoser(loserChar)) ?? []
                        )
                }
            })
        });
    }

    #effectsOnLoser(target: DrawCard): GameAction {
        const effects: GameAction[] = [AbilityDsl.actions.dishonor({ target })];
        if(target.isDishonored) {
            effects.push(AbilityDsl.actions.bow({ target }));
        }
        if(target.isDishonored && target.bowed) {
            effects.push(AbilityDsl.actions.discardFromPlay({ target }));
        }

        return AbilityDsl.actions.multiple(effects);
    }
}
