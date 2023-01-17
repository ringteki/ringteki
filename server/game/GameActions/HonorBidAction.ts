import { PlayerAction, PlayerActionProperties } from './PlayerAction';
import AbilityContext = require('../AbilityContext');
import Player = require('../player');
import { EventNames, Players } from '../Constants';
import HonorBidPrompt = require('../gamesteps/honorbidprompt');
import { GameAction } from './GameAction';
import SimpleStep = require('../gamesteps/simplestep');

export interface HonorBidProperties extends PlayerActionProperties {
    giveHonor?: boolean;
    prohibitedBids?: Array<number>;
    players?: Players;
    postBidAction?: GameAction;
    message?: string;
    messageArgs?: (context: AbilityContext) => any | any[];
}

export class HonorBidAction extends PlayerAction {
    name = 'honorBid';
    eventName = EventNames.OnHonorBid;
    defaultProperties: HonorBidProperties = { 
        giveHonor: false,
        prohibitedBids: [],
        players: Players.Any,
        postBidAction: undefined,
    };

    constructor(propertyFactory: HonorBidProperties | ((context: AbilityContext) => HonorBidProperties)) {
        super(propertyFactory);
    }

    defaultTargets(context) {
        return [context.player];
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let properties: HonorBidProperties = this.getProperties(context);
        if (properties.giveHonor) {
            return ['bid honor', []];
        }

        const players = [];
        switch (properties.players) {
            case Players.Any:
                players.push(context.player);
                players.push(context.player.opponent);
                break;
            case Players.Self:
                players.push(context.player);
                break;
            case Players.Opponent:
                players.push(context.player.opponent);
                break;
        }
        return ['have {0} select a value on their honor dial', [players]];
    }

    addPropertiesToEvent(event, player: Player, context: AbilityContext, additionalProperties): void {
        let { giveHonor, prohibitedBids, players, postBidAction, message, messageArgs } = this.getProperties(context, additionalProperties) as HonorBidProperties;        
        super.addPropertiesToEvent(event, player, context, additionalProperties);
        event.giveHonor = giveHonor;
        event.prohibitedBids = prohibitedBids;
        event.players = players;
        event.postBidAction = postBidAction;
        event.message = message;
        event.messageArgs = messageArgs;
    }

    eventHandler(event): void {
        let context = event.context;

        if (event.players === Players.Any) {
            let prohibitedBids = {};
            for(const player of context.game.getPlayers()) {
                prohibitedBids[player.uuid] = event.prohibitedBids;
            }
            let costHandler = undefined;
            if (!event.giveHonor) {
                costHandler = () => { };
            }
            context.game.queueStep(new HonorBidPrompt(context.game, 'Choose your bid', costHandler, prohibitedBids, null, false));
            context.game.queueStep(new SimpleStep(context.game, () => event.postBidAction.resolve(context.player, context)));
            context.game.queueStep(new SimpleStep(context.game, () => {
                let message, messageArgs;
                if(event.message) {
                    message = event.message;
                    messageArgs = event.messageArgs ? [].concat(event.messageArgs(context)) : [];
                } else {
                    [message, messageArgs] = event.postBidAction.getEffectMessage(context);
                }
                context.game.addMessage(message, ...messageArgs);
            }));
        }
        else {
            const player = (event.players === Players.Self) ? context.player : context.player.opponent;

            event.context.game.promptWithHandlerMenu(player, {
                activePromptTitle: 'Choose a value to set your honor dial at',
                context: event.context,
                choices: ['1', '2', '3', '4', '5'],
                handlers: [1,2,3,4,5].map(value => {
                    return () => context.game.actions.setHonorDial({ value }).resolve(player, context);
                })
            });
        }
    }
}
