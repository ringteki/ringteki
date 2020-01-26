const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class CalledToWar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a bushi',
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.hasTrait('bushi'),
                    gameAction: AbilityDsl.actions.placeFate()
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    optional: true,
                    cardCondition: card => card.hasTrait('bushi'),
                    gameAction: AbilityDsl.actions.placeFate()
                }
            },
            effect: 'places a fate on {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)],
            gameAction: AbilityDsl.actions.takeHonor(context => ({
                amount: (context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) ? 1 : 0
            }))
        });
    }

    buildString(context) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + target.controller.name + ' gives ' + context.player.name + ' 1 honor to place a fate on ' + target.name;
        }
        return '';
    }
}

CalledToWar.id = 'called-to-war';

module.exports = CalledToWar;
