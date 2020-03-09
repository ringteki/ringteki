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
            event.context.game.queueSimpleStep(() => {
                if(event.player.replaceDynastyCard(loc)) {
                    let cards = event.player.getDynastyCardsInProvince(loc);
                    cards.forEach(card => {
                        if(card) {
                            card.facedown = false;
                        }
                    });
                }
            });
        });
    }
}
