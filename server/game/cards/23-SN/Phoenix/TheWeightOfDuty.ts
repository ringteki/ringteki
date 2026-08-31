import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { AbilityType, CardType, Duration, EventName, Location, Players } from '../../../Constants.js';
import BaseCard from '../../../BaseCard.js';
import { EventRegistrar } from '../../../EventRegistrar.js';
import { GameEvent } from '../../../Events/EventPayloads.js';

export default class TheWeightOfDuty extends DrawCard {
    static id = 'the-weight-of-duty';

    private currentTargets = new Set<BaseCard>();
    private extraBanzaiTarget?: BaseCard;
    private abilityRegistrar?: EventRegistrar;

    setupCardAbilities() {
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register([
            {
                [`${EventName.OnInitiateAbilityEffects}:${AbilityType.WouldInterrupt}`]: 'onInitiateAbility'
            }
        ]);

        this.reaction({
            when: {
                onCardAbilityTriggered: (event, context) => {
                    if(event.player === context.player.opponent) {
                        this.currentTargets = this.getLegalCardTargets(event);
                        return this.currentTargets.size > 0;
                    }
                    return false;
                }
            },
            title: 'Honor a character',
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('bushi'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.addKeyword('pride'),
                        duration: Duration.UntilEndOfPhase
                    })
                ])
            }
        });
    }

    public onInitiateAbility(event: GameEvent<EventName.OnInitiateAbilityEffects>) {
        if(event.card.id === 'banzai') {
            if(event.context) {
                this.extraBanzaiTarget = event.context.targets.target as BaseCard;
            }
        }
    }

    private getLegalCardTargets(event: any) {
        const allTargets = new Set<BaseCard>();
        if(!event.context) {
            return allTargets;
        }

        for(const directTargets of Object.values<BaseCard | BaseCard[]>(event.context.targets)) {
            if(!Array.isArray(directTargets)) {
                allTargets.add(directTargets);
                continue;
            }
            for(const directTarget of directTargets) {
                allTargets.add(directTarget);
            }
        }

        for(const selectedTargets of Object.values<BaseCard | BaseCard[]>(event.context.selects)) {
            if(!Array.isArray(selectedTargets)) {
                allTargets.add(selectedTargets);
                continue;
            }
            for(const selectedTarget of selectedTargets) {
                allTargets.add(selectedTarget);
            }
        }

        if(event.card.id === 'banzai') {
            if(this.extraBanzaiTarget) {
                allTargets.add(this.extraBanzaiTarget);
            }
            this.extraBanzaiTarget = undefined;
        }

        const validTargets = new Set<BaseCard>();
        for(let card of allTargets) {
            if(this.isValidTargetForCard(card, event)) {
                validTargets.add(card);
            }
        }

        return validTargets;
    }

    private isValidTargetForCard(card: BaseCard, event: any) {
        return (
            card.type === CardType.Character &&
            card.hasTrait('shugenja') &&
            card.controller !== event.player &&
            card.location === Location.PlayArea
        );
    }
}
