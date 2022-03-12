const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, Locations, CardTypes, TargetModes, Decks } = require('../../../Constants');

class TheWealthOfTheCraneReprint extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at your dynasty deck',
            condition: context => context.player.dynastyDeck.size() > 0,
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: card => card.location !== 'stronghold province',
                gameAction: AbilityDsl.actions.deckSearch({
                    targetMode: TargetModes.UpTo,
                    numCards: 1,
                    amount: 8,
                    activePromptTitle: 'Choose a character to put in your province',
                    cardCondition: card => card.type === CardTypes.Character && !card.isUnique(),
                    deck: Decks.DynastyDeck,
                    gameAction: AbilityDsl.actions.moveCard(context => ({
                        destination: context.target.location,
                        faceup: true
                    }))
                })
            },
            effect: 'put a dynasty character into {1}',
            effectArgs: context => [context.target.facedown ? context.target.location : context.target]
        });
    }
}

TheWealthOfTheCraneReprint.id = 'bird-bucks';

module.exports = TheWealthOfTheCraneReprint;

