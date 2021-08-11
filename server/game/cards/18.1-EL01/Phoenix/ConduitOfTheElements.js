const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Durations, Elements } = require('../../../Constants');

class ConduitOfTheElements extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Give an element to the contested ring',
            when: {
                onCardPlayed: (event, context) => event.player === context.player &&
                    context.source.isParticipating() &&
                    event.card.hasTrait('kiho') &&
                    (event.card.hasTrait('air') || event.card.hasTrait('earth') || event.card.hasTrait('fire') ||
                    event.card.hasTrait('void') || event.card.hasTrait('water')) &&
                    this.game.isDuringConflict()
            },
            gameAction: AbilityDsl.actions.ringLastingEffect(context => ({
                duration: Durations.UntilEndOfConflict,
                target: context.game.currentConflict.ring,
                effect: AbilityDsl.effects.addElement(this.getElementsOfPlayedCard(context))
            })),
            effect: 'add {1} to the conflict ring',
            effectArgs: context => [this.getElements(context)],
        });
    }

    getElementsOfPlayedCard(context) {
        let elements = [];
        const card = context.event.card;
        const eArray = [Elements.Air, Elements.Earth, Elements.Fire, Elements.Water, Elements.Void];
        eArray.forEach(e => {
            if (card.hasTrait(e)) {
                elements.push(e);
            }
        })
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
        let elements = this.getElementsOfPlayedCard(context);
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
