const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Phases } = require('../../../Constants');

class JurojinsBane extends DrawCard {
    setupCardAbilities() {
        this.forcedInterrupt({
            title: 'Discard fate and characters',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Fate && !context.source.parent.bowed && context.source.parent.getFate() > 0
            },
            effect: 'discard all characters without fate and remove 1 fate from each character with fate',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardFromPlay(context => ({
                    target: context.player.cardsInPlay.filter(a => a.getFate() === 0).concat(context.player.opponent ? context.player.opponent.cardsInPlay.filter(a => a.getFate() === 0) : [])
                })),
                AbilityDsl.actions.removeFate(context => ({
                    target: context.player.cardsInPlay.filter(a => a.getFate() !== 0).concat(context.player.opponent ? context.player.opponent.cardsInPlay.filter(a => a.getFate() !== 0) : [])
                }))
            ]),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}

JurojinsBane.id = 'jurojin-s-bane';

module.exports = JurojinsBane;
