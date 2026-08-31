import { AbilityContext } from '../../../AbilityContext.js';
import BaseCard from '../../../BaseCard.js';
import { CardType, Duration, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { GameAction } from '../../../GameActions/GameAction.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class LaughingThunder extends DrawCard {
    static id = 'laughing-thunder';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.gainAllAbilitiesDynamic((card: BaseCard, _context: AbilityContext) => {
                return (card as DrawCard).attachments.filter((a: DrawCard) => a.hasTrait('kiho') && a.printedType === CardType.Event) ?? [];
            })
        });

        this.action({
            title: 'Attach a kiho to this character',
            target: {
                cardType: CardType.Event,
                controller: Players.Self,
                location: Location.Hand,
                cardCondition: (card, context) => card.hasTrait('kiho') &&
                    context.game.actions.attach({ attachment: this.getDummyAttachment(card) }).canAffect(context.source, context)
            },
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                const gameActions: GameAction[] = [];

                gameActions.push(AbilityDsl.actions.cardLastingEffect({
                    target: context.target,
                    duration: Duration.Custom,
                    targetLocation: Location.Any,
                    canChangeZoneOnce: true,
                    until: {
                        onCardDetached: event => event.card === context.target,
                        onCardLeavesPlay: event => event.card === context.target
                    },
                    effect: [
                        AbilityDsl.effects.cannotTriggerAbilities(),
                        AbilityDsl.effects.changeType(CardType.Attachment),
                    ]
                }))

                gameActions.push(AbilityDsl.actions.attach({
                    attachment: context.target,
                    target: context.source,
                }))

                return { gameActions };
            }),
            effect: 'claim the effects of {0} as its own!'
        });
    }


    getDummyAttachment(card: BaseCard) {
        const DummyKihoAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'conflict',
            text: '',
            type: 'attachment',
            name: 'Kiho',
            id: card.id,
            traits: ['kiho']
        });

        return DummyKihoAttachment;
    }

}
