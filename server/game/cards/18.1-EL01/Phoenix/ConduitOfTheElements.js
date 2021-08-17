const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Durations, Elements } = require('../../../Constants');

class ConduitOfTheElements extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Give an element to the contested ring',
            when: {
                onCardPlayed: (event, context) => event.player === context.player &&
                    context.source.isParticipating() && event.card.hasTrait('kiho') && this.game.isDuringConflict()
            },
            gameAction: AbilityDsl.actions.ringLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.game.currentConflict.ring,
                effect: AbilityDsl.effects.addElement(this.getElementsOfAttackedProvinces(context))
            })),
            effect: 'add {1} to the conflict ring',
            effectArgs: context => [this.getElements(context)]
        });
    }

    getElementsOfAttackedProvinces(context) {
        let elements = [];
        context.game.currentConflict.getConflictProvinces().forEach(a => {
            elements = elements.concat(a.getElement());
        });
        return elements;
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
        let elements = this.getElementsOfAttackedProvinces(context);
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

ConduitOfTheElements.id = 'conduit-of-the-elements';
module.exports = ConduitOfTheElements;
