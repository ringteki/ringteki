const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { Players } = require('../../Constants');

class CompromisedSecrets extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.parent && context.source.parent.controller !== context.source.controller,
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.additionalTriggerCost(context =>
                this.parent && context.source === this.parent ? [AbilityDsl.costs.giveHonorToOpponent(1)] : []
            )
        });
    }

    canPlay(context, playType) {
        return context.player.opponent && context.player.honor < context.player.opponent.honor && super.canPlay(context, playType);
    }
}

CompromisedSecrets.id = 'compromised-secrets';

module.exports = CompromisedSecrets;
