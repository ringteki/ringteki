import { Durations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class YuaTheOnibaba extends DrawCard {
    static id = 'yua-the-onibaba';

    public setupCardAbilities() {
        this.action({
            title: 'Weaken non-bushi, empower bushi',
            condition: (context) => context.source.isParticipating(),
            effect: 'give all friendly participating bushi characters =1{1} / +1{2} and give all participating non-bushi characters -1{1} / -1{2}',
            effectArgs: () => ['military', 'political'],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: this.game.currentConflict
                        .getCharacters(context.player)
                        .filter((card: DrawCard) => card.hasTrait('bushi')),
                    effect: AbilityDsl.effects.modifyBothSkills(1),
                    duration: Durations.UntilEndOfConflict
                })),
                AbilityDsl.actions.cardLastingEffect((context) => ({
                    target: this.game.currentConflict
                        .getCharacters(context.player)
                        .filter((card: DrawCard) => !card.hasTrait('bushi'))
                        .concat(
                            this.game.currentConflict
                                .getCharacters(context.player.opponent)
                                .filter((card: DrawCard) => !card.hasTrait('bushi'))
                        ),
                    effect: AbilityDsl.effects.modifyBothSkills(-1),
                    duration: Durations.UntilEndOfConflict
                }))
            ])
        });
    }
}
