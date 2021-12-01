const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');

class KhanbulakBenefactorReprint extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Reduce cost of next event',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.context.ability.getReducedCost(event.context) > 0
            },
            effect: 'reduce the cost of their next card by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card === context.event.card)
            }))
        });

        this.reaction({
            title: 'Draw a card',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.draw()
        });
    }
}

KhanbulakBenefactorReprint.id = 'khanbulak-philanthropist';

module.exports = KhanbulakBenefactorReprint;
