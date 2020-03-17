import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { Locations } from '../Constants';

export interface FillProvinceProperties extends PlayerActionProperties {
    location: Locations;
    fillTo?: number;
    faceup?: boolean;
}

export class FillProvinceAction extends PlayerAction {
    defaultProperties: FillProvinceProperties = {
        location: Locations.ProvinceOne,
        fillTo: 1,
        faceup: false
    }

    name = 'fill';
    effect = 'fills {0} with more cards';
    constructor(propertyFactory: FillProvinceProperties | ((context: AbilityContext) => FillProvinceProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties = this.getProperties(context) as FillProvinceProperties;
        return ['fills {0} to {1} cards!', [properties.location, properties.fillTo]]
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties) as FillProvinceProperties;
        let currentCards = event.player.getDynastyCardsInProvince(properties.location).length;
        event.player.refillProvince(properties.location, properties.fillTo - currentCards);

        if (properties.faceup) {
            event.context.game.queueSimpleStep(() => {
                let cards = event.player.getDynastyCardsInProvince(properties.location);
                cards.forEach(card => {
                    if(card) {
                        card.facedown = false;
                    }
                });
            });
        }
    }
}
