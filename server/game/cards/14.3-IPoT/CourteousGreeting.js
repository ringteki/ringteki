const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes, Elements } = require('../../Constants');

const elementKey = 'courteous-greeting-earth';

class CourteousGreeting extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character from each side',
            conflictProvinceCondition: province => province.isElement(this.getCurrentElementSymbol(elementKey)),
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                },
                oppCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: card => card.isParticipating(),
                    gameAction: AbilityDsl.actions.bow()
                }
            },
            effect: 'bow {1} and {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.oppCharacter]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Province Type',
            element: Elements.Earth
        });
        return symbols;
    }
}

CourteousGreeting.id = 'courteous-greeting';

module.exports = CourteousGreeting;

