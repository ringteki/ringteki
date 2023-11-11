import AbilityContext = require('../../../AbilityContext');
import { ConflictTypes, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl = require('../../../abilitydsl');
import Player = require('../../../player');

type ConflictRecord = {
    attackingPlayer: Player;
    winner?: Player;
    declaredType: ConflictTypes;
    passed: boolean;
    uuid: string;
};

export default class CliffsOfTheSeaDragon extends ProvinceCard {
    static id = 'cliffs-of-the-sea-dragon';

    public setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Opponent,
            condition: (context) =>
                !context.game.conflictRecord.some((conflict) => this.isTurnedOff(context, conflict)),
            effect: AbilityDsl.effects.playerCannot('takeFateFromRings')
        });
    }

    private isTurnedOff(context: AbilityContext, conflict: ConflictRecord) {
        const lostByDragon = conflict.winner === context.source.controller.opponent;
        const passedByAnyone = conflict.passed;
        return lostByDragon || passedByAnyone;
    }
}
