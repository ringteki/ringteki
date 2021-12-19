const ProvinceCard = require('../../../provincecard.js');
const { CardTypes, Stages } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class MagistrateStationReprint extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from bowing',
            when: {
                onCardBowed: (event, context) => context.game.isDuringConflict() && event.card.type === CardTypes.Character && event.card.controller === context.player &&
                    event.context.stage === Stages.Effect && event.card.isHonored && event.card.isParticipating()
            },
            effect: 'prevent {1} from bowing',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

MagistrateStationReprint.id = 'magistrate-outpost';

module.exports = MagistrateStationReprint;
