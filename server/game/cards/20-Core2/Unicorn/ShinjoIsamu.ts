import { Elements, Players } from '../../../Constants';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import type { Conflict } from '../../../conflict';
import DrawCard from '../../../drawcard';
import type Game from '../../../game';
import type Ring from '../../../ring';

export default class ShinjoIsamu extends DrawCard {
    static id = 'shinjo-isamu';

    setupCardAbilities() {
        this.reaction({
            title: 'Resolve a ring effect',
            when: {
                onSendHome: (event, context) => this.#triggerCondition(event, context),
                onReturnHome: (event, context) => this.#triggerCondition(event, context)
            },
            gameAction: AbilityDsl.actions.chooseAction((context) => ({
                activePromptTitle: 'Choose ring to resolve',
                player: Players.Self,
                options: Object.fromEntries(
                    Object.entries(this.#elements(context.game)).map(([label, ring]) => [
                        label,
                        {
                            action: AbilityDsl.actions.resolveRingEffect({ target: ring }),
                            message: `{0} chooses to resolve the ${label} ring effect`
                        }
                    ])
                )
            }))
        });
    }

    #triggerCondition(event: any, context: TriggeredAbilityContext) {
        return (
            event.card === context.source &&
            (context.game.currentConflict as Conflict | undefined)
                ?.getConflictProvinces()
                .some((province) => !province.isBroken)
        );
    }

    #elements(game: Game) {
        return (game.currentConflict as Conflict).getConflictProvinces().reduce((acc, province) => {
            if (!province.isBroken) {
                for (const element of province.element as Elements[]) {
                    switch (element) {
                        case Elements.Air:
                            acc.set('Air', game.rings.air);
                        case Elements.Earth:
                            acc.set('Earth', game.rings.earth);
                        case Elements.Fire:
                            acc.set('Fire', game.rings.fire);
                        case Elements.Water:
                            acc.set('Water', game.rings.water);
                        case Elements.Void:
                            acc.set('Void', game.rings.void);
                    }
                }
            }
            return acc;
        }, new Map<string, Ring>());
    }
}