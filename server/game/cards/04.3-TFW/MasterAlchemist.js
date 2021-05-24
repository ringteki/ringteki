const DrawCard = require('../../drawcard.js');
const { CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

const elementKey = 'master-alchemist-fire';

class MasterAlchemist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            cost: AbilityDsl.costs.payFateToRing(1, ring => ring.hasElement(this.getCurrentElementSymbol(elementKey))),
            condition: () => this.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.chooseAction({
                    messages: {
                        'Honor this character': '{0} chooses to honor {1}',
                        'Dishonor this character': '{0} chooses to dishonor {1}'
                    },
                    choices: {
                        'Honor this character': AbilityDsl.actions.honor(),
                        'Dishonor this character': AbilityDsl.actions.dishonor()
                    }
                })
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring for Fate',
            element: Elements.Fire
        });
        return symbols;
    }
}

MasterAlchemist.id = 'master-alchemist';

module.exports = MasterAlchemist;
