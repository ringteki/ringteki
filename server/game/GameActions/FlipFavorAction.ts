import { PlayerAction, PlayerActionProperties} from './PlayerAction';
import { EventNames } from '../Constants';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { GameAction, GameActionProperties } from './GameAction';

export interface FlipFavorProperties extends PlayerActionProperties {
    target: Player | null;
}

export class FlipFavorAction extends PlayerAction {
    name = 'claimFavor';
    eventName = EventNames.OnFlipFavor;
    effect = 'flip the Imperial favor';

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return this.playerHasFlippableFavor(context.player) || this.playerHasFlippableFavor(context.player.opponent);
    }

    playerHasFlippableFavor(player: Player) {
        return player && !!player.imperialFavor && player.imperialFavor !== 'both';
    }

    canAffect(player: Player, context: AbilityContext, additionalProperties = {}): boolean {
        return !!player && this.playerHasFlippableFavor(player) && super.canAffect(player, context);
    }

    getProperties(context: AbilityContext, additionalProperties = {}): FlipFavorProperties {
        let properties = super.getProperties(context, additionalProperties) as FlipFavorProperties;
        return properties;
    }

    eventHandler(event): void {
        if(event.player.imperialFavor === 'military')
            event.player.imperialFavor = 'political';
        else if(event.player.imperialFavor === 'political')
            event.player.imperialFavor = 'military';
    }
}
