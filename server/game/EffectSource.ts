import AbilityDsl from './abilitydsl';
import { Durations, Locations } from './Constants';
import type Game from './game';
import { GameObject } from './GameObject';

// This class is inherited by Ring and BaseCard and also represents Framework effects
export class EffectSource extends GameObject {
    constructor(game: Game, name = 'Framework effect') {
        super(game, name);
    }


    /**
     * Applies an immediate effect which lasts until the end of the phase.
     */
    untilEndOfPhase(propertyFactory) {
        const properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(
            Object.assign({ duration: Durations.UntilEndOfPhase, location: Locations.Any }, properties)
        );
    }

    /**
     * Applies a lasting effect which lasts until an event contained in the
     * `until` property for the effect has occurred.
     */
    lastingEffect(propertyFactory) {
        let properties = propertyFactory(AbilityDsl);
        this.addEffectToEngine(Object.assign({ duration: Durations.Custom, location: Locations.Any }, properties));
    }

    /*
     * Adds a persistent/lasting/delayed effect to the effect engine
     * @param {Object} properties - properties for the effect - see Effects/Effect.js
     */
    addEffectToEngine(properties) {
        const { effect, ...otherProperties } = properties;
        if (Array.isArray(effect)) {
            return effect.map((factory) => this.game.effectEngine.add(factory(this.game, this, otherProperties)));
        }
        return [this.game.effectEngine.add(effect(this.game, this, otherProperties))];
    }

    removeEffectFromEngine(effectArray) {
        this.game.effectEngine.unapplyAndRemove((effect) => effectArray.includes(effect));
    }

    removeLastingEffects() {
        this.game.effectEngine.removeLastingEffects(this);
    }
}