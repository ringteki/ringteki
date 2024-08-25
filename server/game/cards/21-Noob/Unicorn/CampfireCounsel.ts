import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CampfireCounsel extends DrawCard {
    static id = 'campfire-counsel';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) =>
                    event.card.controller === context.player &&
                    (event.context.source.type === 'ring' ||
                        (context.player.opponent && event.context.player === context.player.opponent))
            },
            cannotBeMirrored: true,
            cost: AbilityDsl.costs.dishonor({
                cardCondition: (card, context: any) => card === context.event?.card
            }),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.ready((context) => ({ target: (context as any).event.card })),
                AbilityDsl.actions.conditional({
                    condition: (context) => context.player.isTraitInPlay('storyteller'),
                    trueGameAction: AbilityDsl.actions.draw(),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ])
        });
    }
}
