const DrawCard = require('../../../drawcard.js');
const { TargetModes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class OtterFisherman extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.immunity({
                    restricts: 'creature'
                })]
        }),
        this.reaction({
            title: 'Gain resource after claiming water',
            when: {
                onClaimRing: (_, context) => context.game.isDuringConflict('water')
            },
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                activePromptTitle: 'Choose an option for your opponent',
                choices: {
                    'Opponent gains 1 fate': AbilityDsl.actions.gainFate(context => ({
                        target: context.source.controller,
                        amount: 1
                    })),
                    'Opponent gains 1 honor': AbilityDsl.actions.gainHonor(context => ({
                        target: context.source.controller,
                        amount: 1
                    })),
                    'Opponent draws 1 card': AbilityDsl.actions.draw(context => ({
                        target: context.source.controller,
                        amount: 1
                    }))
                }
            }
        });
    }
}

OtterFisherman.id = 'otter-fisherman';

module.exports = OtterFisherman;
