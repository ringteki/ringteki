const AbilityDsl = require('../../../abilitydsl');
const { Players, TargetModes } = require('../../../Constants');
const ProvinceCard = require('../../../provincecard.js');

class JadeColoredRocks extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Make your opponent lose a resource',
            target: {
                mode: TargetModes.Select,
                player: Players.Self,
                activePromptTitle: 'Choose an option',
                choices: {
                    'Opponent loses 1 fate': AbilityDsl.actions.loseFate(context => ({
                        amount: 1,
                        target: context.player.opponent
                    })),
                    'Opponent loses 1 honor': AbilityDsl.actions.loseHonor(context => ({
                        amount: 1,
                        target: context.player.opponent
                    })),
                    'Opponent discards 1 card at random': AbilityDsl.actions.discardAtRandom(context => ({
                        amount: 1,
                        target: context.player.opponent
                    }))
                }
            }
        });
    }
}

JadeColoredRocks.id = 'jade-colored-rocks';

module.exports = JadeColoredRocks;
