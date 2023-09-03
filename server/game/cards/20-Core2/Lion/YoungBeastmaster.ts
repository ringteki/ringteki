import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class YoungBeastmaster extends DrawCard {
    static id = 'young-beastmaster';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain a +X/+0 bonus',
            when: {
                onConflictDeclared: (event, context) => event.attackers.includes(context.source)
            },
            cost: AbilityDsl.costs.discardCardSpecific((context) => context.player.dynastyDeck.first()),
            effect: 'give {0} +{1}{2}',
            effectArgs: (context) => [this.#bonusSize(context.costs.discardCard?.[0]), 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#bonusSize(context.costs.discardCard?.[0]))
            }))
        });
    }

    #bonusSize(card?: DrawCard) {
        if (card == undefined) {
            return 0;
        }
        const cost = card.getCost();
        return isNaN(cost) ? 0 : cost;
    }
}
