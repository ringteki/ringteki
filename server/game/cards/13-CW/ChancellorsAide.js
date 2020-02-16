const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, TargetModes } = require('../../Constants');

class ChancellorsAide extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Player discards a card',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            targets: {
                myPlayer: {
                    mode: TargetModes.Select,
                    targets: true,
                    choices: {
                        [this.owner.name]: AbilityDsl.actions.chosenDiscard(context => ({ target: context.player })),
                        [this.owner.opponent.name]: AbilityDsl.actions.chosenDiscard(context => ({ target: context.player.opponent }))
                    }
                },
                oppPlayer: {
                    mode: TargetModes.Select,
                    targets: true,
                    player: Players.Opponent,
                    choices: {
                        [this.owner.name]: AbilityDsl.actions.joint([
                            AbilityDsl.actions.takeHonor(context => ({ target: context.player.opponent })),
                            AbilityDsl.actions.chosenDiscard(context => ({ target: context.player}))
                        ]),
                        [this.owner.opponent.name]: AbilityDsl.actions.joint([
                            AbilityDsl.actions.takeHonor(context => ({ target: context.player.opponent })),
                            AbilityDsl.actions.chosenDiscard(context => ({ target: context.player.opponent}))
                        ]),
                        ['Done']: () => true
                    }
                }
            }
        });
    }
}

ChancellorsAide.id = 'chancellor-s-aide';

module.exports = ChancellorsAide;
