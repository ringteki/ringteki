const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { DuelTypes, Players } = require('../../Constants');

class TaoistAdept extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a military duel',
            initiateDuel: {
                type: DuelTypes.Military,
                message: 'choose whether to place a fate on a ring',
                gameAction: duel => AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose a ring to receive a fate',
                    player: (duel.winner && duel.winner.controller === context.player) ? Players.Self : Players.Opponent,
                    message: '{0} places a fate on the {1}',
                    messageArgs: (ring, player) => [player, ring],
                    ringCondition: ring => duel.winner && ring.isUnclaimed(),
                    gameAction: AbilityDsl.actions.placeFateOnRing(),
                    optional: true,
                    onMenuCommand: (player, arg) => {
                        if(arg === 'done') {
                            this.game.addMessage(player.name + ' chooses not to place a fate on a ring');
                            return true;
                        }
                        return true;
                    }
                }))
            }
        });
    }
}

TaoistAdept.id = 'taoist-adept';

module.exports = TaoistAdept;
