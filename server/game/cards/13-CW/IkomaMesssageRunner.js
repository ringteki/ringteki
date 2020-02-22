const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class IkomaMessageRunner extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip a card faceup',
            targets: {
                myCard: {
                    activePromptTitle: 'Choose a facedown card in your provinces',
                    location: Locations.Provinces,
                    controller: Players.Self,
                    cardCondition: card => card.isDynasty && card.facedown,
                    gameAction: AbilityDsl.actions.flipDynasty()
                },
                opponentsCard: {
                    activePromptTitle: 'Choose a facedown card in opponents provinces',
                    location: Locations.Provinces,
                    controller: Players.Opponent,
                    cardCondition: card => card.isDynasty && card.facedown,
                    gameAction: AbilityDsl.actions.flipDynasty()
                }
            },
            effect: 'reveal a facedown card in each players province.',
            effectArgs: () => []
        });
    }
}

IkomaMessageRunner.id = 'ikoma-message-runner';

module.exports = IkomaMessageRunner;
