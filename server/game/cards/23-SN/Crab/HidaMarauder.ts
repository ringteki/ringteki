import DrawCard from '../../../DrawCard.js';
import Player from '../../../Player.js';
import AbilityDsl from '../../../abilitydsl.js';
import { shuffle } from '../../../utils/shuffle.js';

export default class HidaMarauder extends DrawCard {
    static id = 'hida-marauder';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard an opponent\'s card',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() &&
                    event.conflict.winner === context.source.controller &&
                    context.player.opponent
            },
            gameAction: AbilityDsl.actions.multipleContext((context) => {
                const count = context.game.currentConflict?.getCharacters(context.player)?.length || 0;
                const cards =
                    context.player.opponent && count > 0
                        ? shuffle(context.player.opponent.hand).slice(0, count)
                        : [context.source];
                return {
                    gameActions: [
                        AbilityDsl.actions.lookAt(() => ({
                            target: cards.slice().sort((a, b) => a.name.localeCompare(b.name))
                        })),
                        AbilityDsl.actions.cardMenu((context) => ({
                            cards: cards.slice().sort((a, b) => a.name.localeCompare(b.name)),
                            targets: true,
                            message: '{0} chooses {1} to be discarded',
                            messageArgs: (card) => [context.player, card],
                            gameAction: AbilityDsl.actions.discardCard()
                        }))
                    ]
                };
            }),
            effect: 'look at {1} random card{3} in {2}\'s hand',
            effectArgs: (context) => [
                (context.game.currentConflict?.getCharacters(context.player)?.length || 0),
                context.player.opponent as Player,
                (context.game.currentConflict?.getCharacters(context.player)?.length || 0) === 1 ? '' : 's'
            ]
        });
    }
}
