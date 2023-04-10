const { CalculateHonorLimit } = require('../GameActions/Shared/HonorLogic.js');

const BaseAbility = require('../baseability.js');
const { TargetModes } = require('../Constants');
const { GameModes } = require('../../GameModes.js');

class AirRingEffect extends BaseAbility {
    constructor(optional = true, gameMode = GameModes.Stronghold) {
        let choices = { };
        if(gameMode !== GameModes.Skirmish) {
            choices['Gain 2 Honor'] = () => true;
        }
        choices['Take 1 Honor from opponent'] = (context) => context.player.opponent && context.player.opponent.checkRestrictions('takeHonor', context);
        choices['Don\'t resolve'] = () => optional;
        super({
            target: {
                mode: TargetModes.Select,
                activePromptTitle: 'Choose an effect to resolve',
                source: 'Air Ring',
                choices: choices
            }
        });
        this.title = 'Air Ring Effect';
        this.cannotTargetFirst = true;
        this.defaultPriority = 5; // Default resolution priority when players have ordering switched off
    }

    executeHandler(context) {
        if(context.select === 'Gain 2 Honor') {
            let [, amountToTransfer] = CalculateHonorLimit(context.player, context.game.roundNumber, context.game.currentPhase, 2);
            context.game.addMessage('{0} resolves the {1} ring, gaining {2} honor', context.player, 'air', amountToTransfer);
            context.game.actions.gainHonor({ amount: 2 }).resolve(context.player, context);
        } else if(context.select === 'Take 1 Honor from opponent') {
            context.game.addMessage('{0} resolves the {1} ring, taking 1 honor from {2}', context.player, 'air', context.player.opponent);
            context.game.actions.takeHonor().resolve(context.player.opponent, context);
        } else if(!context.game.currentConflict || context.game.currentConflict.element === 'air') {
            context.game.addMessage('{0} chooses not to resolve the {1} ring', context.player, context.game.currentConflict ? 'air' : context.game.currentConflict.element);
        }
    }
}

module.exports = AirRingEffect;
