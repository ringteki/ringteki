import { GameModes } from '../GameModes';
import { AirRingEffect } from './Rings/AirRingEffect';
import { EarthRingEffect } from './Rings/EarthRingEffect';
import { FireRingEffect } from './Rings/FireRingEffect';
import { VoidRingEffect } from './Rings/VoidRingEffect';
import { WaterRingEffect } from './Rings/WaterRingEffect';
import AbilityContext = require('./AbilityContext');
import BaseAbility = require('./baseability');
import Player = require('./player');

type Element = 'air' | 'earth' | 'fire' | 'void' | 'water';

type RingProps = {
    name: string;
    factory: (optional: boolean, gameMode: GameModes) => RingAbility;
};

interface RingAbility extends BaseAbility {
    title: string;
    cannotTargetFirst: boolean;
    defaultPriority: number;
    executeHandler(context: AbilityContext): void;
}

const ringForElement: Record<Element, RingProps> = {
    air: { name: 'Air Ring', factory: (optional, gameMode) => new AirRingEffect(optional, gameMode) },
    earth: { name: 'Earth Ring', factory: (optional, gameMode) => new EarthRingEffect(optional, gameMode) },
    fire: { name: 'Fire Ring', factory: (optional) => new FireRingEffect(optional) },
    void: { name: 'Void Ring', factory: (optional) => new VoidRingEffect(optional) },
    water: { name: 'Water Ring', factory: (optional, gameMode) => new WaterRingEffect(optional, gameMode) }
};

export class RingEffects {
    static contextFor(player: Player, element: string, optional = true) {
        const ring = ringForElement[element];
        if (!ring) {
            throw new Error(`Unknown ring effect of ${element}`);
        }

        const context = player.game.getFrameworkContext(player);
        context.source = player.game.rings[element];
        const gameModeWithDefault = context.game.gameMode || GameModes.Stronghold;
        context.ability = ring.factory(optional, gameModeWithDefault);
        return context;
    }

    static getRingName(element: string): undefined | string {
        return ringForElement[element] ? ringForElement[element].name : undefined;
    }
}
