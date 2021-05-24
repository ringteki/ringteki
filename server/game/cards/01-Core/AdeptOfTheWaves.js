const DrawCard = require('../../drawcard.js');
const { Durations, CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

const elementKey = 'adept-of-the-waves-water';

class AdeptOfTheWaves extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant Covert to a character',
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    duration: Durations.UntilEndOfPhase,
                    condition: () => this.game.isDuringConflict(this.getCurrentElementSymbol(elementKey)),
                    effect: AbilityDsl.effects.addKeyword('covert')
                }))
            },
            effect: 'grant Covert during Water conflicts to {0}'
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Contested Ring',
            element: Elements.Water
        });
        return symbols;
    }
}

AdeptOfTheWaves.id = 'adept-of-the-waves';

module.exports = AdeptOfTheWaves;
