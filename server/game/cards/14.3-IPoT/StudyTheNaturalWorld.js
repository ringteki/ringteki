const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Durations } = require('../../Constants');

class StudyTheNaturalWorld extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Add elements to the conflict ring',
            condition: context => context.player.anyCardsInPlay(card => card.isAttacking() && card.hasTrait('scholar')),
            effect: 'add {1} to the conflict ring. They may resolve all elements if they win the conflict',
            effectArgs: context => [this.getElements(context)],
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ringLastingEffect(context => ({
                    duration: Durations.UntilEndOfConflict,
                    target: context.game.currentConflict.ring,
                    effect: AbilityDsl.effects.addElement(context.game.currentConflict.conflictProvince.element)
                })),
                AbilityDsl.actions.playerLastingEffect({
                    condition: context => context.game.currentConflict.winner === context.player,
                    effect: AbilityDsl.effects.modifyConflictElementsToResolve(5),
                    duration: Durations.UntilEndOfConflict
                })
            ])
        });
    }

    getElements(context) {
        const capitalize = {
            air: 'Air',
            water: 'Water',
            earth: 'Earth',
            fire: 'Fire',
            void: 'Void'
        };

        let string = '';
        let elements = context.game.currentConflict.conflictProvince.getElement();
        for(let i = 0; i < elements.length; i++) {
            if(i !== 0) {
                if(i === elements.length - 1) {
                    string += ' and ';
                } else {
                    string += ', ';
                }
            }
            string += capitalize[elements[i]];
        }

        return string;
    }
}

StudyTheNaturalWorld.id = 'study-the-natural-world';

module.exports = StudyTheNaturalWorld;
