const EffectValue = require('./EffectValue');
const GainAbility = require('./GainAbility');
const { AbilityTypes, Locations } = require('../Constants');

class GainAllAbilitiesDynamic extends EffectValue {
    constructor(match) {
        super(match);
        this.match = match;
        this.createdAbilities = {};
        this.abilitiesForTargets = {};
        this.queriedCharacters = [];
    }

    _setAbilities(cards, target) {
        if(!Array.isArray(cards)) {
            cards = [cards];
        }

        this.actions = [];
        this.reactions = [];
        this.persistentEffects = [];
        cards.forEach(card => {
            card.actions.forEach(action => this.actions.push(this.getAbility(AbilityTypes.Action, action, target)));
            card.reactions.filter(a => !a.isKeywordAbility()).forEach(ability => {
                this.reactions.push(this.getAbility(ability.abilityType, ability, target))
            });
            // this.actions = card.abilities.actions.map(action => new GainAbility(AbilityTypes.Action, action));
            //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
            // this.reactions = card.abilities.reactions.filter(a => !a.isKeywordAbility()).map(ability => new GainAbility(ability.abilityType, ability));
            // this.persistentEffects = card.abilities.persistentEffects.map(effect => Object.assign({}, effect));
        })

        // if (type === 'action') {
        //     this.actions = [];
        // } else if (type === 'reaction') {
        //     this.reactions = [];
        // } else if (type === 'persistent') {
        //     this.persistentEffects = [];
        // }
        // cards.forEach(card => {
        //     if (type === 'action') {
        //         card.abilities.actions.forEach(action => this.actions.push(this.getAbility(AbilityTypes.Action, action)));
        //     } else if (type === 'reaction') {
        //         card.abilities.reactions.filter(a => !a.isKeywordAbility()).forEach(ability => this.reactions.push(this.getAbility(ability.abilityType, ability)));
        //     } else if (type === 'persistent') {
        //         card.abilities.persistentEffects.forEach(effect => this.persistentEffects.push(Object.assign({}, effect)));
        //     }
        //     // this.actions = card.abilities.actions.map(action => new GainAbility(AbilityTypes.Action, action));
        //     //Need to ignore keyword reactions or we double up on the pride / courtesy / sincerity triggers
        //     // this.reactions = card.abilities.reactions.filter(a => !a.isKeywordAbility()).map(ability => new GainAbility(ability.abilityType, ability));
        //     // this.persistentEffects = card.abilities.persistentEffects.map(effect => Object.assign({}, effect));
        // })
    }

    getAbilityIdentifier(ability) {
        return `${ability.abilityIdentifier}-${ability.card.uuid}`;
    }

    getAbility(abilityType, ability, target) {
        const id = this.getAbilityIdentifier(ability);
        if(!this.createdAbilities[id]) {
            const res = new GainAbility(abilityType, ability);
            res.apply(target);
            this.createdAbilities[id] = res;
        }
        return this.createdAbilities[id];
    }

    calculate(target, context) {
        let cards = [];
        if(typeof this.match === 'function') {
            cards = this.match(context);
        } else {
            cards = this.match;
        }

        this._setAbilities(cards, target);

        this.abilitiesForTargets[target.uuid] = {
            actions: this.actions.map(value => {
                // value.apply(target);
                return value.getValue();
            }),
            reactions: this.reactions.map(value => {
                // value.apply(target);
                return value.getValue();
            })
        };
        for(const effect of this.persistentEffects) {
            if(effect.location === Locations.PlayArea || effect.location === Locations.Any) {
                effect.ref = target.addEffectToEngine(effect);
            }
        }  
    }

    apply(target) {
        if(this.abilitiesForTargets[target.uuid]) {
            for(const value of this.abilitiesForTargets[target.uuid].reactions) {
                value.registerEvents();
            }
        }
        // this.abilitiesForTargets = {};
    }

    unapply(target) {
        for(const value of this.abilitiesForTargets[target.uuid].reactions) {
            value.unregisterEvents();
        }
        for(const effect of this.persistentEffects) {
            if(effect.ref) {
                target.removeEffectFromEngine(effect.ref);
                delete effect.ref;
            }
        }
        // delete this.abilitiesForTargets[target.uuid];
    }

    getActions(target) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].actions;
        }
        return [];
    }

    getReactions(target) {
        if(this.abilitiesForTargets[target.uuid]) {
            return this.abilitiesForTargets[target.uuid].reactions;
        }
        return [];
    }

    getPersistentEffects() {
        return this.persistentEffects;
    }
}

module.exports = GainAllAbilitiesDynamic;
