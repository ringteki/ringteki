const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, EventNames } = require('../../Constants');

class YoungRumormonger extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Honor/dishonor a different character',
            when: {
                onCardHonored: (event) => event.card.type === CardTypes.Character,
                onCardDishonored: (event) => event.card.type === CardTypes.Character
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) =>
                    card !== context.event.card && card.controller === context.event.card.controller,
                gameAction: AbilityDsl.actions.cancel((context) => ({
                    replacementGameAction:
                        // @ts-ignore
                        context.event.name === EventNames.OnCardHonored
                            ? AbilityDsl.actions.honor()
                            : AbilityDsl.actions.dishonor()
                }))
            }
        });
    }
}

YoungRumormonger.id = 'young-rumormonger';

module.exports = YoungRumormonger;
