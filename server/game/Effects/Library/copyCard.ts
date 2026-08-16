import type BaseCard from '../../BaseCard.js';
import type { StoredPersistentEffect } from '../../BaseCard.js';
import { AbilityType, Location, CardType, EffectName } from '../../Constants.js';
import type { CardAction } from '../../CardAction.js';
import type TriggeredAbility from '../../TriggeredAbility.js';
import { EffectBuilder } from '../EffectBuilder.js';
import { EffectValue } from '../EffectValue.js';
import GainAbility from '../GainAbility.js';
import { ProvinceCard } from '../../ProvinceCard.js';

class CopyCard extends EffectValue<BaseCard> {
    actions: Array<GainAbility>;
    reactions: Array<GainAbility>;
    persistentEffects: StoredPersistentEffect[];
    abilitiesForTargets = new WeakMap<
        BaseCard,
        {
            actions: CardAction[];
            reactions: TriggeredAbility[];
        }
    >();

    constructor(card: BaseCard) {
        super(card);
        this.actions = card.abilities.actions.map((action: CardAction) => new GainAbility(AbilityType.Action, action));
        this.reactions = card.abilities.reactions.map(
            (ability: TriggeredAbility) => new GainAbility(ability.abilityType, ability)
        );
        this.persistentEffects = card.abilities.persistentEffects.map((effect) => Object.assign({}, effect));
    }

    apply(target: BaseCard) {
        this.abilitiesForTargets.set(target, {
            actions: this.actions.map((value) => {
                value.apply(target);
                return value.getValue() as CardAction;
            }),
            reactions: this.reactions.map((value) => {
                value.apply(target);
                return value.getValue() as TriggeredAbility;
            })
        });
        for (const effect of this.persistentEffects) {
            if (
                effect.location === Location.Any ||
                (target.getType() === CardType.Character && effect.location === Location.PlayArea) ||
                (target.getType() === CardType.Holding && effect.location === Location.Provinces)
            ) {
                effect.ref = target.addEffectToEngine({ ...effect, location: effect.location });
            }
        }
    }

    unapply(target: BaseCard) {
        for (const value of this.abilitiesForTargets.get(target)?.reactions ?? []) {
            value.unregisterEvents();
        }
        for (const effect of this.persistentEffects) {
            if (effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                delete effect.ref;
            }
        }
        this.abilitiesForTargets.delete(target);
    }

    getActions(target: BaseCard) {
        return this.abilitiesForTargets.get(target)?.actions ?? [];
    }

    getReactions(target: BaseCard) {
        const copied = this.abilitiesForTargets.get(target)?.reactions ?? [];
        const ownKeywordReactions = target.abilities.reactions.filter(
            (ability) => typeof ability.isKeywordAbility === 'function' && ability.isKeywordAbility()
        );
        return [...copied, ...ownKeywordReactions];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

export function copyCard(character: BaseCard) {
    return EffectBuilder.card.static(EffectName.CopyCharacter, new CopyCard(character));
}

export function copyProvince(province: ProvinceCard) {
    return EffectBuilder.card.static(EffectName.CopyProvince, new CopyCard(province));
}
