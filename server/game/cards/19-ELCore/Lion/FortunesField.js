const { Durations, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const ProvinceCard = require('../../../provincecard.js');

class FortunesField extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardPlayed: (event) => event.card.type === CardTypes.Character
            },
            title: 'Reduce cost of next character or follower by 1',
            effect: 'reduce the cost of their next character or follower this round by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfRound,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(1, card => card.type === CardTypes.Character || card.hasTrait('follower'))
            }))
        });
    }
}

FortunesField.id = 'fortune-s-field';

module.exports = FortunesField;
