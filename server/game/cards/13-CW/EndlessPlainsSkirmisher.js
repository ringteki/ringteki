const DrawCard = require('../../drawcard.js');
const { TargetModes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class EndlessPlainsSkirmisher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this character to the confict',
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Which side should this character be on?',
                choices: {
                    'Mine': AbilityDsl.actions.moveToConflict({ side: Players.Self }),
                    'My Opponent\'s': AbilityDsl.actions.moveToConflict({ side: Players.Opponent })
                }
            },
            effect: 'join the conflict for {1}!',
            effectArgs: context => this.getEffectArg(context, context.select)
        });
    }

    getEffectArg(context, selection) {
        if(selection === 'Mine') {
            return context.player.name;
        }
        return context.player.opponent.name;
    }
}

EndlessPlainsSkirmisher.id = 'endless-plains-skirmisher';

module.exports = EndlessPlainsSkirmisher;
