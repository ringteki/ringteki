const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, CardTypes } = require('../../../Constants');

class PresenceOfTheLordsOfDeath extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard a fate from a character',
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.removeFate()
                },
                oppCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.removeFate()
                }
            },
            then: {
                gameAction: AbilityDsl.actions.gainFate(context => ({
                    target: context.player,
                    amount: 1
                }))
            },
            effect: 'remove a fate from {1} and {2} and gain a fate',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }
}

PresenceOfTheLordsOfDeath.id = 'presence-of-the-lords-of-death';

module.exports = PresenceOfTheLordsOfDeath;
