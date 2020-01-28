const DrawCard = require('../../drawcard.js');
const { TargetModes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class EndlessPlainsSkirmisher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move this character to the confict',
            condition: context => !context.source.isParticipating(),
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Which side should this character be on?',
                choices: {
                    'Mine': () => true,
                    'My Opponent\'s': context => context.player.opponent
                }
            },
            gameAction: AbilityDsl.actions.moveToConflict(context => ({ side: context.select === 'Mine' ? Players.Self : Players.Opponent })),
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
