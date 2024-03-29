const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations } = require('../../Constants.js');

class Reprieve extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent && event.card.location === Locations.PlayArea &&
                                                      context.source.allowGameAction('discardFromPlay', context)
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.discardFromPlay()
            }))
        });
    }
}

Reprieve.id = 'reprieve';

module.exports = Reprieve;
