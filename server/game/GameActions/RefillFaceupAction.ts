import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { Locations } from '../Constants';

export interface RefillFaceupProperties extends PlayerActionProperties {
    location: Locations | Locations[];
}

export class RefillFaceupAction extends PlayerAction {
    defaultProperties: RefillFaceupProperties;

    name = 'refill';
    effect = 'refill its province faceup';
    constructor(propertyFactory: RefillFaceupProperties | ((context: AbilityContext) => RefillFaceupProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event, additionalProperties): void {
        let { location } = this.getProperties(event.context, additionalProperties) as RefillFaceupProperties;
        if (!Array.isArray(location)) {
            location = [location];
        }

        location.forEach(loc => {
            if(event.player.replaceDynastyCard(loc)) {
                event.context.game.queueSimpleStep(() => {
                    let card = event.player.getDynastyCardInProvince(loc);
                    if(card) {
                        card.facedown = false;
                    }
                });
            }
        });
    }
}
