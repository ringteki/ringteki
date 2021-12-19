const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Durations, CardTypes } = require('../../../Constants.js');

class UtakuTetsukoReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Prevent your next event from being cancelled',
            condition: context => context.source.isAttacking(),
            effect: 'take an additional action and prevent their next event this conflict from being cancelled',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    duration: Durations.Custom,
                    until: {
                        onCardPlayed: event => event.card.type === CardTypes.Event && event.player === context.player,
                        onConflictFinished: () => true,
                    },
                    targetController: context.player,
                    effect: AbilityDsl.effects.eventsCannotBeCancelled()
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: context.player,
                    duration: Durations.UntilPassPriority,
                    effect: AbilityDsl.effects.additionalAction()
                }))
            ])
        });
    }
}

UtakuTetsukoReprint.id = 'definitely-not-tetsuko';

module.exports = UtakuTetsukoReprint;
