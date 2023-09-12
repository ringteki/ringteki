import type BaseAction from '../../../BaseAction';
import { EventNames } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import { StrongholdCard } from '../../../StrongholdCard';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';

export default class CrabBox extends StrongholdCard {
    static id = 'crab-box';

    private playersWhoDidFirstAction = new Set<string>();
    private abilityRegistrar: EventRegistrar;

    setupCardAbilities() {
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([EventNames.OnCardAbilityTriggered, EventNames.OnConflictDeclared]);

        this.wouldInterrupt({
            title: 'Cancel triggered ability',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    (event.context.ability as BaseAction).abilityType === 'action' &&
                    !this.playersWhoDidFirstAction.has(event.context.player.uuid) &&
                    context.player.anyCardsInPlay((card: DrawCard) => card.isDefending())
            },
            cost: AbilityDsl.costs.bowSelf(),
            effect: "cancel the effects of {1}'s ability",
            effectArgs: (context) => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    public onCardAbilityTriggered(event: any) {
        if (
            !this.playersWhoDidFirstAction.has(event.context.player.uuid) &&
            this.game.isDuringConflict() &&
            event.context.ability.abilityType === 'action' &&
            !event.context.ability.isKeywordAbility() &&
            !event.context.ability.cannotBeCancelled
        ) {
            this.playersWhoDidFirstAction.add(event.context.player.uuid);
        }
    }

    public onConflictDeclared() {
        this.playersWhoDidFirstAction.clear();
    }
}
