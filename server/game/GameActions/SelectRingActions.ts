import type { AbilityContext } from '../AbilityContext';
import { Players } from '../Constants';
import type Player from '../player';
import type Ring from '../ring';
import type { GameAction } from './GameAction';
import { RingAction, type RingActionProperties } from './RingAction';

export interface SelectRingProperties extends RingActionProperties {
    activePromptTitle?: string;
    player?: Players;
    targets?: boolean;
    ringCondition?: (ring: Ring, context: AbilityContext) => boolean;
    cancelHandler?: () => void;
    subActionProperties?: (ring: Ring) => any;
    message?: string;
    messageArgs?: (ring: Ring, player: Player) => any[];
    gameAction: GameAction;
}

export class SelectRingAction extends RingAction {
    defaultProperties: SelectRingProperties = {
        ringCondition: () => true,
        subActionProperties: (ring) => ({ target: ring }),
        gameAction: null
    };

    constructor(properties: SelectRingProperties | ((context: AbilityContext) => SelectRingProperties)) {
        super(properties);
    }

    getEffectMessage(context: AbilityContext): [string, any[]] {
        let { target } = this.getProperties(context);
        return ['choose a ring for {0}', [target]];
    }

    canAffect(ring: Ring, context: AbilityContext, additionalProperties = {}): boolean {
        let properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        if (properties.player === Players.Opponent && !context.player.opponent) {
            return false;
        }
        return (
            super.canAffect(ring, context) &&
            properties.ringCondition(ring, context) &&
            properties.gameAction.hasLegalTarget(
                context,
                Object.assign({}, additionalProperties, properties.subActionProperties(ring))
            )
        );
    }

    hasLegalTarget(context: AbilityContext, additionalProperties = {}): boolean {
        return Object.values(context.game.rings).some((ring: Ring) =>
            this.canAffect(ring, context, additionalProperties)
        );
    }

    addEventsToArray(events, context: AbilityContext, additionalProperties = {}): void {
        let properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        if (properties.player === Players.Opponent && !context.player.opponent) {
            return;
        } else if (
            !Object.values(context.game.rings).some((ring: Ring): boolean => properties.ringCondition(ring, context))
        ) {
            return;
        } else if (!this.hasLegalTarget(context, additionalProperties)) {
            return;
        }
        let player = properties.player === Players.Opponent ? context.player.opponent : context.player;
        if (properties.targets && context.choosingPlayerOverride) {
            player = context.choosingPlayerOverride;
        }
        let defaultProperties = {
            context: context,
            buttons: properties.cancelHandler ? [{ text: 'Cancel', arg: 'cancel' }] : [],
            onCancel: properties.cancelHandler,
            onSelect: (player, ring) => {
                if (properties.message) {
                    context.game.addMessage(properties.message, ...properties.messageArgs(ring, player));
                }
                properties.gameAction.addEventsToArray(
                    events,
                    context,
                    Object.assign({}, additionalProperties, properties.subActionProperties(ring))
                );
                return true;
            }
        };
        context.game.promptForRingSelect(
            player,
            Object.assign(defaultProperties, properties, {
                ringCondition: (ring, context) =>
                    properties.ringCondition(ring, context) &&
                    properties.gameAction.hasLegalTarget(
                        context,
                        Object.assign({}, additionalProperties, properties.subActionProperties(ring))
                    )
            })
        );
    }

    hasTargetsChosenByInitiatingPlayer(context: AbilityContext, additionalProperties = {}): boolean {
        let properties = super.getProperties(context, additionalProperties) as SelectRingProperties;
        return properties.targets && properties.player !== Players.Opponent;
    }
}
