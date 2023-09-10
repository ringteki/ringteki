import { CardTypes, Players, Decks } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class TradeFleetCommissar extends DrawCard {
    static id = 'trade-fleet-commissar';

    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.game.currentConflict.getNumberOfParticipants(card => card.hasTrait('mantis')) > 0,
            effect: AbilityDsl.effects.modifyBothSkills(1)
        });

        this.action({
            title: 'Take 1 fate',
            condition: context => context.source.isParticipating() &&
                context.player.opponent && context.player.opponent.fate < context.player.fate,
            gameAction: AbilityDsl.actions.takeFate()
        });
    }
}
