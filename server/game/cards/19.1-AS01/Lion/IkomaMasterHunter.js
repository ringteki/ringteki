const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, TargetModes, Phases, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class IkomaMasterHunter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'move in and ready when target joins',
            when: {
                onPhaseStarted: (event, _) => event.phase === Phases.Conflict 
            },
            target: {
                mode: TargetModes.Single,
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    target: context.source,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onMoveToConflict: event => event.card === context.target,
                            onDefendersDeclared: event => event.conflict.getParticipants().includes(context.target),
                            onConflictDeclared: event => event.conflict.getParticipants().includes(context.target)
                        },
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.moveToConflict({ 
                                target: context.source
                            }),
                            AbilityDsl.actions.ready({ 
                                target: context.source
                            })
                        ]),
                    })
                }))
            },
            effect: 'track {0}'
        });
    }
}

IkomaMasterHunter.id = 'ikoma-master-hunter';

module.exports = IkomaMasterHunter;
