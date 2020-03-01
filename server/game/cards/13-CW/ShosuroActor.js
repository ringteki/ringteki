const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class ShosuroActor extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Choose a character to copy',
            condition: context => context.source.isParticipating(),
            target: {
                player: Players.Self,
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    effect: AbilityDsl.effects.copyCharacter(context.target)
                }))
            },
            effect: 'become a copy of {1}',
            effectArgs: context => [context.target]
        });
    }
}

ShosuroActor.id = 'shosuro-actor';

module.exports = ShosuroActor;
