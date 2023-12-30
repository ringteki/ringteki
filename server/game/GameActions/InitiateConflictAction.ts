import type { AbilityContext } from '../AbilityContext';
import { ConflictTypes, EventNames } from '../Constants';
import type Player from '../player';
import { PlayerAction, type PlayerActionProperties } from './PlayerAction';

export interface InitiateConflictProperties extends PlayerActionProperties {
    canPass?: boolean;
    forcedDeclaredType?: ConflictTypes;
}

export class InitiateConflictAction extends PlayerAction {
    name = 'initiateConflict';
    eventName = EventNames.OnConflictInitiated;
    effect = 'declare a new conflict';
    defaultProperties: InitiateConflictProperties = {
        canPass: true
    };
    constructor(properties: InitiateConflictProperties | ((context: AbilityContext) => InitiateConflictProperties)) {
        super(properties);
    }

    canAffect(player: Player, context: AbilityContext): boolean {
        let { forcedDeclaredType } = this.getProperties(context) as InitiateConflictProperties;
        return super.canAffect(player, context) && player.hasLegalConflictDeclaration({ forcedDeclaredType });
    }

    defaultTargets(context: AbilityContext): Player[] {
        return [context.player];
    }

    eventHandler(event, additionalProperties): void {
        let properties = this.getProperties(event.context, additionalProperties) as InitiateConflictProperties;
        event.context.game.initiateConflict(event.player, properties.canPass, properties.forcedDeclaredType);
    }
}
