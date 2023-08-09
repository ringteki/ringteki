import { TargetModes } from '../../../Constants';
import type TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import ProvinceCard = require('../../../provincecard');

export default class RedwoodsTreehouse extends ProvinceCard {
    static id = 'redwoods-treehouse';

    public setupCardAbilities() {
        this.reaction({
            title: 'Draw cards or force the opponent to discard cards',
            when: {
                onConflictDeclared: (event, context) =>
                    event.conflict.declaredProvince === context.source &&
                    context.player.opponent &&
                    context.player.hand.size() < context.player.opponent.hand.size()
            },
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Draw cards': AbilityDsl.actions.draw((context) => ({
                        amount: this.#cardDifference(context)
                    })),
                    'Force opponent to discard cards': AbilityDsl.actions.chosenDiscard((context) => ({
                        amount: this.#cardDifference(context),
                        target: context.player.opponent
                    }))
                }
            },
            effect: '{1}',
            effectArgs: (context) => context.select.toLowerCase()
        });
    }

    #cardDifference(context: TriggeredAbilityContext): number {
        return Math.max(0, context.player.opponent.hand.size() - context.player.hand.size());
    }
}