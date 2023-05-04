import { Locations } from '../../Constants';
import AbilityDsl = require('../../abilitydsl');
import { BaseOni } from './BaseOni';

export default class OnikageRider extends BaseOni {
    static id = 'onikage-rider';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Discard cards in provinces',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent
            },
            gameAction: AbilityDsl.actions.discardCard((context) => ({
                target: context.player.opponent.getDynastyCardsInProvince(Locations.Provinces)
            }))
        });
    }
}
