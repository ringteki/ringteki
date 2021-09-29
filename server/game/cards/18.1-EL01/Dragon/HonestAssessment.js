const DrawCard = require('../../../drawcard.js');
const { Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class HonestAssessment extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'courtier',
            myControl: true
        });

        this.reaction({
            title: 'Name a card',
            when: {
                onCardAttached: (event, context) => event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            cost: AbilityDsl.costs.nameCard(),
            max: AbilityDsl.limit.perRound(1),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let cards = context.player.opponent.hand.shuffle().slice(0, 4).sort((a, b) => a.name.localeCompare(b.name));
                return ({
                    gameActions: [
                        AbilityDsl.actions.lookAt(() => ({
                            target: cards.sort(card => card.name)
                        })),
                        AbilityDsl.actions.discardMatching(context => ({
                            target: context.player.opponent,
                            cards: cards.sort((a, b) => a.name.localeCompare(b.name)),
                            amount: -1, //all
                            reveal: false,
                            match: (context, card) => card.name === context.costs.nameCardCost
                        }))
                    ]
                });
            }),
            effect: 'look at 4 random cards in {1}\'s hand and discard all cards named {2}',
            effectArgs: context => [context.player.opponent, context.costs.nameCardCost]
        });
    }
}

HonestAssessment.id = 'honest-assessment';

module.exports = HonestAssessment;
