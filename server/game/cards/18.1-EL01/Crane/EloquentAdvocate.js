const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Durations, DuelTypes } = require('../../../Constants');

class EloquentAdvocate extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Give a character a political bonus',
            when: { onDuelStarted: event => event.duel.type === DuelTypes.Political },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) => context.event.duel.isInvolved(card),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(context.source.getPoliticalSkill()),
                    duration: Durations.UntilEndOfDuel
                })),
            },
            effect: 'give {0} +{1}{2} until the end of the duel',
            effectArgs: context => [context.source.getPoliticalSkill(), 'political']
        });
    }
}

EloquentAdvocate.id = 'eloquent-advocate';
module.exports = EloquentAdvocate;

