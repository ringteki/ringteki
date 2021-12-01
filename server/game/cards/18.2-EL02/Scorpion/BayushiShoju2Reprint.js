const DrawCard = require('../../../drawcard.js');
const { Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class BayushiShoju2Reprint extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.canContributeGloryWhileBowed()
        });

        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'have each player lose an honor and draw two cards',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.loseHonor(context => ({
                    target: context.game.getPlayers()
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.game.getPlayers(),
                    amount: 2
                }))
            ])
        });
    }
}

BayushiShoju2Reprint.id = 'bayushi-shoj-2';

module.exports = BayushiShoju2Reprint;
