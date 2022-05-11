const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class KakitasFirstKata extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) => event.card.controller === context.player &&
                    (event.card.isFaction('crane') || event.card.hasTrait('duelist')) && event.card.type === CardTypes.Character &&
                    (event.context.source.type === 'ring' || event.context.ability.isCardAbility()) &&
                    context.player.opponent && event.context.player === context.player.opponent
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready(context => ({ target: context.event.card })),
                AbilityDsl.actions.discardAtRandom(context => ({
                    target: context.player.opponent,
                    amount: context.event.card.glory
                }))
            ]),
            effect: 'ready {1} and make {2} discard {3} card{4} at random',
            effectArgs: context => [context.event.card, context.player.opponent, context.event.card.glory, context.event.card.glory !== 1 ? 's' : '']
        });
    }
}

KakitasFirstKata.id = 'kakita-s-first-kata';

module.exports = KakitasFirstKata;
