const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Phases, Durations } = require('../../../Constants.js');

class InLadyDojisService extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Give Courtiers Courtesy',
            when: {
                onPhaseStarted: event => event.phase === Phases.Fate
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                effect: AbilityDsl.effects.addKeyword('courtesy'),
                target: context.player.cardsInPlay.filter(card => card.hasTrait('courtier') && card.isHonored),
                duration: Durations.UntilEndOfPhase
            })),
            effect: 'give Courtesy to {1}',
            effectArgs: context => [context.player.cardsInPlay.filter(card => card.hasTrait('courtier') && card.isHonored)]
        });
    }
}

InLadyDojisService.id = 'in-lady-doji-s-service';

module.exports = InLadyDojisService;


