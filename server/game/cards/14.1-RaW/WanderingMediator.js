const DrawCard = require('../../drawcard.js');
const { Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class WanderingMediator extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move in/out the conflict',
            condition: context => context.game.isDuringConflict() && context.game.currentConflict.getConflictProvinces().some(a => a.isElement(Elements.Air)),
            gameAction: AbilityDsl.actions.conditional({
                condition: context => context.source.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome(context => ({
                    target: context.source
                })),
                falseGameAction: AbilityDsl.actions.moveToConflict(context => ({
                    target: context.source
                }))
            })
        });
    }
}

WanderingMediator.id = 'wandering-mediator';

module.exports = WanderingMediator;
