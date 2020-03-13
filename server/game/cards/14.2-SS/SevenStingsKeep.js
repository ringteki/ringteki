const StrongholdCard = require('../../strongholdcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Durations } = require('../../Constants');

class SevenStingsKeep extends StrongholdCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Special Conflict',
            when: {
                onConflictOpportunityAvailable: (event, context) => event.player === context.player
            },
            cost: [AbilityDsl.costs.bowSelf()],
            effect: 'to force {1} to declare defenders before attackers are chosen this conflict',
            effectArgs: context => [context.player.opponent],
            gameAction: AbilityDsl.actions.menuPrompt(context => ({
                activePromptTitle: 'Choose how many characters will be attacking',
                choices: this.getChoices(context),
                gameAction: AbilityDsl.actions.playerLastingEffect({
                    duration: Durations.UntilEndOfConflict
                }),
                choiceHandler: (choice, displayMessage) => {
                    let amount = parseInt(choice);
                    if(displayMessage) {
                        this.game.addMessage('{0} will attack with {1} character{2}', context.player, choice, (choice === '1' ? '' : 's'));
                    }
                    return {
                        effect: AbilityDsl.effects.defendersChosenFirstDuringConflict(amount)
                    };
                }
            }))
        });
    }

    getChoices(context) {
        let min = 1; //Math.max(1, context.event.forcedAttackers.forcedNumberOfAttackers);
        let max = context.event.forcedAttackers.maximumNumberOfAttackers;
        let array = [];
        let i = min;
        for(i = min; i <= max; i++) {
            array.push(i.toString());
        }
        return array;
    }
}

SevenStingsKeep.id = 'seven-stings-keep';
module.exports = SevenStingsKeep;

