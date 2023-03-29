const DrawCard = require('../../../drawcard.js');
const { TargetModes, Players, Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

const elementKey = 'otter-fisherman-water';

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
                onClaimRing: (event, context) => ((event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(elementKey))) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey))) && event.player === context.player
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

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Elements.Water
        });
        return symbols;
    }
}

OtterFisherman.id = 'otter-fisherman';

module.exports = OtterFisherman;
