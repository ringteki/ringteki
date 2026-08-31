import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class AdvanceFortification extends DrawCard {
    static id = 'advance-fortification';

    setupCardAbilities() {
        this.action({
            title: 'Take an honor from your opponent or give skill bonus',
            condition: context => !!context.game.currentConflict && context.game.currentConflict.defendingPlayer === context.player && !context.player.getProvinceCardInProvince(context.source.location)?.isBroken,
            gameAction: AbilityDsl.actions.conditional({
                condition: context => {
                    return !!context.player.getProvinceCardInProvince(context.source.location)?.isConflictProvince();
                },
                trueGameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict?.getCharacters(context.player) ?? [],
                    effect: AbilityDsl.effects.modifyBothSkills(1)
                })),
                falseGameAction: AbilityDsl.actions.loseHonor(context => ({
                    target: context.player.opponent,
                    amount: 1
                }))
            }),
            max: AbilityDsl.limit.perConflict(1),
            effect: '{1}{2}{3}',
            effectArgs: context => context.player.getProvinceCardInProvince(context.source.location)?.isConflictProvince() ?
                ['give defending characters +1/+1', ''] : ['make ', context.player.opponent, ' lose 1 honor']
        });
    }
}
