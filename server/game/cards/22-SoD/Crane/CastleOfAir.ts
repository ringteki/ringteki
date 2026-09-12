import { AbilityType, EventName, CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import BaseCard from '../../../BaseCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import type { Event } from '../../../Events/Event.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';


export default class CastleOfAir extends DrawCard {
    static id = 'castle-of-air';
    private eventRegistrar?: EventRegistrar;
    private playersTriggered = new Map<string, boolean>();

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            {
                [EventName.OnModifyHonor + ':' + AbilityType.WouldInterrupt]: 'onHonorLoss'
            }
        ]);
        this.eventRegistrar.register([EventName.OnConflictFinished]);

        this.action({
            title: 'Add Province Strength',
            cost: AbilityDsl.costs.bow({
                cardType: CardType.Character,
                cardCondition: (card: BaseCard) => card.hasTrait('shugenja')
            }),
            effect: 'increase the strength of an attacked province by 4{1}',
            effectArgs: context => context.player.hasAffinity('air', context) ? [' and prevent unopposed honor loss'] : [''],
            condition: (context) => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.selectCard((context) => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardType.Province,
                    location: Location.Provinces,
                    cardCondition: (card) => card.isConflictProvince(),
                    message: '{0} increases the strength of {1}',
                    messageArgs: (cards) => [context.player, cards],
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        targetLocation: Location.Provinces,
                        effect: AbilityDsl.effects.modifyProvinceStrength(4)
                    })
                })),
                AbilityDsl.actions.conditional((context) => ({
                    condition: context.player.hasAffinity('air', context),
                    trueGameAction: AbilityDsl.actions.handler({
                        handler: context => {
                            this.playersTriggered.set(context.player.uuid, true);
                        }
                    }),
                    falseGameAction: AbilityDsl.actions.noAction()
                }))
            ])
        });
    }

    onHonorLoss(event: Event & EventPayload<EventName.OnModifyHonor>) {
        if(
            event.context.game.currentConflict &&
            event.dueToUnopposed &&
            !!this.playersTriggered.get(event.context.player.uuid) &&
            !event.cancelled
        ) {
            event.cancel();
            this.game.addMessage('{0} cancels the honor loss', this);
        }
    }

    public onConflictFinished() {
        this.playersTriggered.clear();
    }
}
