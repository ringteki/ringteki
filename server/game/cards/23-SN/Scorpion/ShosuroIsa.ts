import { EventName, Players, Duration, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import BaseCard from '../../../BaseCard.js';
import { EventPayload } from '../../../Events/EventPayloads.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class ShosuroIsa extends DrawCard {
    static id = 'shosuro-isa';

    private shadows: BaseCard[] = [];
    private eventRegistrar?: EventRegistrar;

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventName.OnCardLeavesPlay]);

        this.action({
            title: 'Manifest a shadow',
            target: {
                activePromptTitle: 'Choose a character from a discard pile',
                location: [Location.DynastyDiscardPile, Location.ConflictDiscardPile],
                controller: Players.Self,
                cardCondition: (card) => !card.isUnique(),
                gameAction: AbilityDsl.actions.putIntoPlay()
            },
            effect: 'manifest a shadow of {0}',
            then: (context: AbilityContext) => ({
                thenCondition: () => context.target?.location === Location.PlayArea,
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        target: context.target,
                        duration: Duration.Custom,
                        until: {
                            onCardLeavesPlay: event => event.card === context.target
                        },
                        effect: [
                            AbilityDsl.effects.setBaseMilitarySkill(0),
                            AbilityDsl.effects.setBasePoliticalSkill(0),
                            AbilityDsl.effects.addTrait('shadow')
                        ]
                    }),
                    AbilityDsl.actions.handler({
                        handler: () => {
                            if(context.target) {
                                this.shadows.push(context.target);
                            }
                        }
                    })
                ])
            })
        });
    }

    public onCardLeavesPlay(event: EventPayload<EventName.OnCardLeavesPlay>) {
        if(
            this.shadows.includes(event.card) &&
            event.card.location !== Location.RemovedFromGame
        ) {
            this.shadows = this.shadows.filter(a => a !== event.card);
            this.game.addMessage(
                '{0} fades into nothingness and is removed from the game due to leaving play',
                event.card
            );
            event.card.owner.moveCard(event.card, Location.RemovedFromGame);
        }
    }
}
