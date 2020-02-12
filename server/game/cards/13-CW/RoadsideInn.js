const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, Phases } = require('../../Constants');

class RoadsideInn extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place a fate on a character',
            when: {
                onPhaseStarted: event => event.phase === Phases.Fate
            },
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.placeFate( context => ({ origin: context.player }) )
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    optional: true,
                    gameAction: AbilityDsl.actions.joint([
                        AbilityDsl.actions.takeHonor(context => ({ target: context.player.opponent })),
                        AbilityDsl.actions.placeFate( context => ({ origin: context.player.opponent }) )
                    ])
                }
            },
            effect: 'place a fate from their pool on {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)]
        });
    }

    buildString(context) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + target.controller.name + ' gives ' + context.player.name + ' 1 honor to place a fate from their pool on ' + target.name;
        }
        return '';
    }
}

RoadsideInn.id = 'roadside-inn';

module.exports = RoadsideInn;