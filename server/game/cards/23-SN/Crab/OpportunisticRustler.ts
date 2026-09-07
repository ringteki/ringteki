import DrawCard from '../../../DrawCard.js';
import { AbilityContext } from '../../../AbilityContext.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';
import AbilityDsl from '../../../abilitydsl.js';
import { EventName, ConflictType, TargetMode, Decks, Location } from '../../../Constants.js';
import { GameAction } from '../../../GameActions/GameAction.js';

export default class OpportunisticRustler extends DrawCard {
    static id = 'opportunistic-rustler';

    setupCardAbilities() {
        this.reaction({
            title: 'Look at your opponent\'s dynasty deck',
            when: {
                onConflictDeclared: (event: EventPayload<EventName.OnConflictDeclared>, context) => event.attackers?.includes(context.source) && event.conflict.conflictType === ConflictType.Military
            },
            effect: 'look at {1}\'s dynasty deck',
            effectArgs: context => [context.player.opponent],
            gameAction: AbilityDsl.actions.deckSearch(context => ({
                targetMode: TargetMode.Single,
                numCards: 1,
                amount: (context: AbilityContext) => context.game.currentConflict?.declaredProvince?.printedStrength || 1,
                player: context.player.opponent,
                choosingPlayer: context.player,
                deck: Decks.DynastyDeck,
                placeOnBottomInRandomOrder: true,
                shuffle: false,
                // [player] puts [card] faceup into the attacked province and gives [source] +XMIL
                // [player] removes [card] from the game and gives [source] +XMIL
                message: '{0} {1} {2} {3} {4} +{5}{6}',
                messageArgs: (context, cards) => cards[0].hasTrait('cavalry') ?
                    [context.player, 'removes', cards, 'from the game and gives', context.source, cards[0].getTraitSet().size, 'military'] :
                    [context.player, 'puts', cards, 'faceup into the attacked province and gives', context.source, cards[0].getTraitSet().size, 'military'],
                gameAction: AbilityDsl.actions.multipleContext((context: AbilityContext) => {
                    const selected: DrawCard = context?.deckSearchSelected[0];
                    if(!selected || !context.game.currentConflict) {
                        return { gameActions: [AbilityDsl.actions.noAction()] };
                    }
                    const numberOfTraits = selected.getTraitSet().size;

                    const gameActions: Array<GameAction> = [];
                    gameActions.push(AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.source,
                        effect: AbilityDsl.effects.modifyMilitarySkill(numberOfTraits)
                    })));

                    if(selected.hasTrait('cavalry')) {
                        gameActions.push(AbilityDsl.actions.moveCard({ target: selected, destination: Location.RemovedFromGame }));
                    } else {
                        gameActions.push(AbilityDsl.actions.moveCard({ target: selected, faceup: true, destination: context.game.currentConflict.declaredProvince?.location }));
                    }

                    return { gameActions };
                })
            }))
        });
    }
}
