import { EffectValue } from './EffectValue.js';
import GainAbility from './GainAbility.js';
import { AbilityType } from '../Constants.js';
import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import type CardAbility from '../CardAbility.js';
import type { CardAction } from '../CardAction.js';
import type TriggeredAbility from '../TriggeredAbility.js';

export type DynamicMatch = ((target: BaseCard, context: AbilityContext) => BaseCard | BaseCard[]) | BaseCard | BaseCard[];

interface GainedAbilities {
    actions: unknown[];
    reactions: TriggeredAbility[];
}

// This ignores persistent effects since it's used by Shosuro Deceiver who only takes triggered abilities
export default class GainAllAbilitiesDynamic extends EffectValue<DynamicMatch> {
    match: DynamicMatch;
    createdAbilities: Record<string, GainAbility>;
    abilitiesForTargets: Record<string, GainedAbilities>;
    actions: GainAbility[];
    reactions: GainAbility[];
    persistentEffects: unknown[];
    printedAbilitiesOnly: boolean;

    constructor(match: DynamicMatch, printedAbilitiesOnly = false) {
        super(match);
        this.match = match;
        this.createdAbilities = {};
        this.abilitiesForTargets = {};
        this.actions = [];
        this.reactions = [];
        this.persistentEffects = [];
        this.printedAbilitiesOnly = printedAbilitiesOnly;
    }

    _setAbilities(cards: BaseCard | BaseCard[], target: BaseCard) {
        const cardList: BaseCard[] = Array.isArray(cards) ? cards : [cards];

        this.actions = [];
        this.reactions = [];
        this.persistentEffects = [];
        cardList.forEach((card: BaseCard) => {
            card._getActions(true)
                .filter((a: CardAction) => a.isTriggeredAbility() && (!card.isBlank() || (!this.printedAbilitiesOnly && !a.printedAbility)))
                .forEach((action: CardAction) => this.actions.push(this.getAbility(AbilityType.Action, action, target)));
            card._getReactions(true)
                .filter((a: TriggeredAbility) => a.isTriggeredAbility() && (!card.isBlank() || (!this.printedAbilitiesOnly && !a.printedAbility)))
                .forEach((ability: TriggeredAbility) => {
                    this.reactions.push(this.getAbility(ability.abilityType, ability, target));
                });
        });
    }

    getAbilityIdentifier(ability: CardAbility): string {
        return `${ability.abilityIdentifier}-${ability.card.uuid}`;
    }

    getAbility(abilityType: AbilityType, ability: CardAbility, target: BaseCard): GainAbility {
        const id = this.getAbilityIdentifier(ability);
        if (!this.createdAbilities[id]) {
            const res = new GainAbility(abilityType, ability);
            this.createdAbilities[id] = res;
            this.createdAbilities[id].apply(target);
        }
        return this.createdAbilities[id];
    }

    calculate(target: BaseCard, context: AbilityContext) {
        let cards: BaseCard | BaseCard[] = [];
        if (typeof this.match === 'function') {
            cards = this.match(target, context);
        } else {
            cards = this.match;
        }

        this.unapply(target);
        this._setAbilities(cards, target);
        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map((value) => {
                return value.getValue() as CardAction;
            }),
            reactions: this.reactions.map((value) => {
                return value.getValue() as TriggeredAbility;
            })
        };
        this._applyAbilities(target);
    }

    _applyAbilities(target: BaseCard) {
        if (this.abilitiesForTargets[target.uuid]) {
            for (const value of this.abilitiesForTargets[target.uuid].reactions) {
                value.registerEvents();
            }
        }
    }

    _unapplyAbilities(target: BaseCard) {
        this.unapply(target);
    }

    unapply(target: BaseCard) {
        if (this.abilitiesForTargets[target.uuid]) {
            for (const value of this.abilitiesForTargets[target.uuid].reactions) {
                value.unregisterEvents();
            }
        }
    }

    getActions(target: BaseCard): unknown[] {
        if (this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target: BaseCard): TriggeredAbility[] {
        if (this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects(): unknown[] {
        return this.persistentEffects;
    }
}
