const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Stages } = require('../../Constants');

class SententiousPoet extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onSpendFate: (event, context) =>
                    context.player.opponent &&
                    event.context.player === context.player.opponent &&
                    event.amount > 0 &&
                    event.context.stage === Stages.Cost &&
                    event.context.ability.isCardPlayed() &&
                    context.source.isParticipating(),
                onMoveFate: (event, context) =>
                    context.player.opponent &&
                    event.context.ability.isCardPlayed() &&
                    event.context.player === context.player.opponent &&
                    event.fate > 0 &&
                    context.source.isParticipating() &&
                    event.context.stage === Stages.Cost &&
                    event.recipient.type === 'ring'
            },
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}

SententiousPoet.id = 'sententious-poet';

module.exports = SententiousPoet;
