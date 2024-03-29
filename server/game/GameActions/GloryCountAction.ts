import { AbilityContext } from '../AbilityContext';
import { EventNames } from '../Constants';
import Player from '../player';
import { GameAction, GameActionProperties } from './GameAction';

export interface GloryCountProperties extends GameActionProperties {
    gameAction: ((gloryCountWinner: Player | null, context: AbilityContext) => GameAction) | GameAction;
}

export class GloryCountAction extends GameAction<GloryCountProperties> {
    name = 'gloryCount';
    eventName = EventNames.OnGloryCount;

    hasLegalTarget(): boolean {
        return true;
    }

    addEventsToArray(events: any[], context: AbilityContext, additionalProperties): void {
        events.push(this.getEvent(null, context, additionalProperties));
    }

    eventHandler(event, additionalProperties): void {
        let game = event.context.game;
        let properties = this.getProperties(event.context, additionalProperties);

        let gloryTotals = game.getPlayersInFirstPlayerOrder().map((player) => {
            return player.getGloryCount();
        });
        let winner = game.getFirstPlayer();
        if (winner.opponent) {
            if (gloryTotals[0] === gloryTotals[1]) {
                game.addMessage('Both players are tied in glory at {0}.', gloryTotals[0]);
                game.raiseEvent(EventNames.OnFavorGloryTied);
                winner = null;
            } else if (gloryTotals[0] < gloryTotals[1]) {
                winner = winner.opponent;
                game.addMessage('{0} wins the glory count {1} vs {2}', winner, gloryTotals[1], gloryTotals[0]);
            } else {
                game.addMessage('{0} wins the glory count {1} vs {2}', winner, gloryTotals[0], gloryTotals[1]);
            }
        }

        let gameAction =
            typeof properties.gameAction === 'function'
                ? properties.gameAction(winner, event.context)
                : properties.gameAction;
        if (gameAction && gameAction.hasLegalTarget(event.context) && winner) {
            gameAction.resolve(null, event.context);
        }
    }
}
