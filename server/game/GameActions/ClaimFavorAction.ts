import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import { EventNames, FavorTypes } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');

export interface ClaimFavorProperties extends PlayerActionProperties {
    target: Player | null;
    side?: FavorTypes;
}

export class ClaimFavorAction extends PlayerAction {
    name = 'claimFavor';
    eventName = EventNames.OnClaimFavor;
    effect = "claim the Emperor's favor";

    hasLegalTarget(): boolean {
        return true;
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        return !!player && super.canAffect(player, context);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): ClaimFavorProperties {
        let properties = super.getProperties(context, additionalProperties) as ClaimFavorProperties;
        return properties;
    }

    eventHandler(event, additionalProperties = {}): void {
        let { side } = this.getProperties(event.context, additionalProperties) as ClaimFavorProperties;
        if(event.player) {
            event.player.claimImperialFavor(side);
        }
    }
}
