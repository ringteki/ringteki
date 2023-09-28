import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, Players, PlayTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class IsawaHifumi extends DrawCard {
    static id = 'isawa-hifumi';

    setupCardAbilities() {
        this.action({
            title: 'Play an event from discard',
            effect: 'play an event from discard. IF THIS IS NOT THE FIRST TIME YOU USE THIS ABILITY, PLEASE REMOVE 1 FATE FROM A CHARACTER YOU CONTROL. THE COST IS NOT IMPLEMENTED IN JIGOKU YET.',
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                activePromptTitle: 'Choose an event',
                cardType: CardTypes.Event,
                controller: Players.Self,
                location: Locations.ConflictDiscardPile,
                gameAction: AbilityDsl.actions.playCard({
                    resetOnCancel: true,
                    source: this,
                    playType: PlayTypes.PlayFromHand,
                    postHandler: (eventContext) => {
                        const card = eventContext.source;
                        context.game.addMessage("{0} is removed from the game by {1}'s ability", card, context.source);
                        context.player.moveCard(card, Locations.RemovedFromGame);
                    }
                })
            })),
            max: AbilityDsl.limit.unlimited()
        });
    }
}
