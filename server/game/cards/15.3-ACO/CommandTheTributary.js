import { CardTypes } from '../../Constants.js';

const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class CommandTheTributary extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility('action', {
                title: 'Move 1 fate from an opposing character',
                target: {
                    cardType: CardTypes.Character,
                    gameAction: AbilityDsl.actions.placeFate(context => ({
                        origin: context.source,
                        amount: 1
                    }))
                }
            })
        });
    }
}

CommandTheTributary.id = 'command-the-tributary';

module.exports = CommandTheTributary;
