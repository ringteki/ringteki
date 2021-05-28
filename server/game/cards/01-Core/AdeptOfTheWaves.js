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
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.handler({
                        handler: () => {
                            this.elementWhenTriggered = this.getCurrentElementSymbol(elementKey);
                        }
                    }),
                    AbilityDsl.actions.cardLastingEffect(() => ({
                        duration: Durations.UntilEndOfPhase,
                        condition: () => this.game.isDuringConflict(this.elementWhenTriggered),
                        effect: AbilityDsl.effects.addKeyword('covert')
                    }))
                ])
            },
            effect: 'grant Covert during {1} conflicts to {0}',
            effectArgs: () => [this.getCurrentElementSymbol(elementKey)]
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
