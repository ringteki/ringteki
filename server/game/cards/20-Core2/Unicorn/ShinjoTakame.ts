import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShinjoTakame extends DrawCard {
    static id = 'shinjo-takame';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsProvinceEffects'
            })
        });

        this.reaction({
            title: 'Place a fate on me or become first player',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.conditional(context => ({
                condition: context.player.firstPlayer,
                trueGameAction: AbilityDsl.actions.placeFate({
                    amount: 1,
                    target: context.source
                }),
                falseGameAction: AbilityDsl.actions.handler({
                    handler: (context) => {
                        this.game.setFirstPlayer(context.source.controller)
                    }
                })
            }))
        });
    }
}
