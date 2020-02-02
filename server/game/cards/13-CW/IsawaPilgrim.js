const DrawCard = require('../../drawcard.js');
const { Players, Durations, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IsawaPilgrim extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give control of this character',
            condition: context => context.game.rings.water.isConsideredClaimed(context.player.opponent),
            handler: context => {
                let card = context.source;
                card.controller.cardsInPlay.splice(card.controller.cardsInPlay.indexOf(card), 1);
                card.controller = context.player.opponent;
                card.setDefaultController(card.controller);
                card.controller.cardsInPlay.push(card);

                if(this.game.isDuringConflict()) {
                    if(card.controller.isAttackingPlayer()) {
                        context.game.currentConflict.addAttacker(card);
                        context.game.currentConflict.defenders.splice(context.game.currentConflict.defenders.indexOf(card), 1);
                    } else {
                        context.game.currentConflict.addDefender(card);
                        context.game.currentConflict.attackers.splice(context.game.currentConflict.attackers.indexOf(card), 1);
                    }
                }
            }
        });
    }
}

IsawaPilgrim.id = 'isawa-pilgrim';

module.exports = IsawaPilgrim;
