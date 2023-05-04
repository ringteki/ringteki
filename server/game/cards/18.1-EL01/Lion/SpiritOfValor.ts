import { AbilityTypes, EventNames, Locations, Players } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');

export default class SpiritOfValor extends DrawCard {
    static id = 'spirit-of-valor';

    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([
            { [EventNames.OnCardLeavesPlay + ':' + AbilityTypes.WouldInterrupt]: 'onCardLeavesPlay' }
        ]);

        this.reaction({
            title: 'Put a character into play',
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            target: {
                activePromptTitle: 'Choose a character from your dynasty discard pile',
                location: [Locations.DynastyDiscardPile],
                cardCondition: (card) => card.hasTrait('bushi') && card.costLessThan(3) && !card.isUnique(),
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.putIntoPlay(),
                    AbilityDsl.actions.ifAble((context) => ({
                        ifAbleAction: AbilityDsl.actions.attach({
                            target: context.target,
                            attachment: context.source
                        }),
                        otherwiseAction: AbilityDsl.actions.discardFromPlay({ target: context.source })
                    }))
                ])
            }
        });
    }

    public onCardLeavesPlay(event: any) {
        if (this.parent && event.card === this.parent) {
            if (event.card.location !== Locations.RemovedFromGame) {
                this.game.addMessage('{0} is removed from the game due to the effects of {1}', event.card, this);
                event.card.owner.moveCard(event.card, Locations.RemovedFromGame);
            }
        }
    }
}
