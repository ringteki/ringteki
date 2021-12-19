const DrawCard = require('../../../drawcard.js');
const { CardTypes, TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class YasukiKiyoko extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain fate or draw a card',
            when: {
                onCardLeavesPlay: (event, context) => context.source.isParticipating() && event.cardStateWhenLeftPlay.controller === context.player &&
                                           event.cardStateWhenLeftPlay.type === CardTypes.Character
            },
            limit: AbilityDsl.limit.perRound(2),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Gain 1 fate': AbilityDsl.actions.gainFate(),
                    'Draw 1 card': AbilityDsl.actions.draw()
                }
            }
        });
    }
}

YasukiKiyoko.id = 'yasuki-kiyoko';

module.exports = YasukiKiyoko;
