import AbilityDsl from "../../../abilitydsl";
import DrawCard from "../../../drawcard";

export default class RevealerOfOmens extends DrawCard {
    static id = 'revealer-of-omens';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid === context.player.opponent?.showBid,
            effect: AbilityDsl.effects.modifyBothSkills(+2)
        });
    }
}