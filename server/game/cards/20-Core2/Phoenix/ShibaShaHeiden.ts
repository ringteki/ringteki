import { EventNames, Phases } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { EventRegistrar } from '../../../EventRegistrar';
import type Player from '../../../player';

export default class ShibaShaHeiden extends DrawCard {
    static id = 'shiba-sha-heiden';

    usedResourceTrade = new Set<Player>();

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnRoundEnded, EventNames.OnCardLeavesPlay]);

        this.reaction({
            title: 'Fill this province with a card',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Dynasty
            },
            gameAction: AbilityDsl.actions.fillProvince((context) => ({
                location: context.source.location,
                fillTo: context.source.controller.getDynastyCardsInProvince(context.source.location).length + 1
            })),
            effect: 'fill its province with 1 card'
        });

        /**
         * The card is a single action, but implementing the cost was too much work
         * Should be fixed later when choice costs are implemented
         */
        this.action({
            title: 'Pay 1 fate to draw a card',
            cost: AbilityDsl.costs.payFate(1),
            gameAction: AbilityDsl.actions.draw(),
            condition: (context) => !this.usedResourceTrade.has(context.player),
            then: (context) => {
                this.usedResourceTrade.add(context.player);
            }
        });
        this.action({
            title: 'Discard a card to gain 1 fate',
            cost: AbilityDsl.costs.discardCard(),
            gameAction: AbilityDsl.actions.gainFate(),
            condition: (context) => !this.usedResourceTrade.has(context.player),
            then: (context) => {
                this.usedResourceTrade.add(context.player);
            }
        });
        this.action({
            title: 'Discard a card to draw a card',
            cost: AbilityDsl.costs.discardCard(),
            gameAction: AbilityDsl.actions.draw(),
            condition: (context) => !this.usedResourceTrade.has(context.player),
            then: (context) => {
                this.usedResourceTrade.add(context.player);
            }
        });
    }

    public onRoundEnded() {
        this.usedResourceTrade.clear();
    }

    public onCardLeavesPlay(event: any) {
        if (event.card === this) {
            this.usedResourceTrade.clear();
        }
    }
}
