const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Durations } = require('../../../Constants');

class FieldsOfRollingThunder extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Discard this holding',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player && event.conflict.conflictUnopposed
            },
            gameAction: AbilityDsl.actions.discardFromPlay()
        });

        this.action({
            title: 'Honor a character',
            condition: () => this.game.isDuringConflict(),
            effect: 'honor {0}. They will be dishonored at the end of the conflict if {1} loses the conflict.',
            effectArgs: (context) => [context.source.controller],
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating() && card.isFaction('unicorn'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.honor(),
                    AbilityDsl.actions.cardLastingEffect((context) => {
                        let conflictWhenItWasTriggered = this.game.currentConflict;
                        return {
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onConflictFinished: (event, context) =>
                                        event.conflict === conflictWhenItWasTriggered &&
                                        event.conflict.winner === context.player.opponent
                                },
                                gameAction: AbilityDsl.actions.dishonor({ target: context.target })
                            })
                        };
                    })
                ])
            }
        });
    }
}

FieldsOfRollingThunder.id = 'fields-of-rolling-thunder';

module.exports = FieldsOfRollingThunder;
