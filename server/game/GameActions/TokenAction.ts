import type { StatusToken } from '../StatusToken';
import { GameAction, GameActionProperties } from './GameAction';
import AbilityContext = require('../AbilityContext');

export interface TokenActionProperties extends GameActionProperties {}

export class TokenAction extends GameAction {
    targetType = ['token'];

    defaultTargets(context: AbilityContext): StatusToken[] {
        return context.source.statusTokens ? [...context.source.statusTokens] : [];
    }

    canAffect(target: StatusToken, context: AbilityContext, additionalProperties = {}): boolean {
        if (Array.isArray(target)) {
            return target.length > 0 && target.every((a) => a.type === 'token');
        }
        return target.type === 'token';
    }

    checkEventCondition(event: any, additionalProperties = {}): boolean {
        return this.canAffect(event.token, event.context, additionalProperties);
    }

    addPropertiesToEvent(event, token: StatusToken, context: AbilityContext, additionalProperties): void {
        super.addPropertiesToEvent(event, token, context, additionalProperties);
        event.token = token;
        if (Array.isArray(event.token)) {
            event.token = [...event.token];
        }
    }
}
