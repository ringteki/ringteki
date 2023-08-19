import { CardTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class UtakuStableMaster extends DrawCard {
    static id = 'utaku-stable-master';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context.player && card.isHonored,
            effect: AbilityDsl.effects.modifyGlory(1)
        });

        this.persistentEffect({
            match: (card, context) => card.controller === context.player && card.isDishonored,
            effect: AbilityDsl.effects.modifyGlory(-1)
        });

        this.action({
            title: 'Bow participating character with lower glory than participating cavalry.',
            condition: context => context.game.currentConflict.getParticipants(card => card.controller === context.player && card.hasTrait('cavalry')),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                mode: TargetModes.Single,
                cardCondition: (card: DrawCard, context) =>
                    card.glory < Math.max(...context.game.currentConflict.getParticipants(card =>
                        card.controller === context.player && card.hasTrait('cavalry')).map(x => x.glory)),
                gameAction: AbilityDsl.actions.bow()
            }
        })
    }
}
