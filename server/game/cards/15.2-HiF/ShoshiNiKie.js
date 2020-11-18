const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players, TargetModes } = require('../../Constants.js');
const DrawCard = require('../../drawcard.js');

const shoshiNiKieCost = () => {
    return {
        action: { name: 'shoshiNiKieCost', getCostMessage: () => ''},
        canPay: function(context) {
            return context.player.getProvinces().some(p => p.facedown);
        },
        resolve: function(context) {
            context.game.promptForSelect(context.player, {
                activePromptTitle: 'Select a province to reveal',
                mode: TargetModes.Single,
                cardCondition: (card) => card.isFacedown(),
                controller: Players.Self,
                cardType: CardTypes.Province,
                player: Players.Self,
                gameAction: AbilityDsl.actions.reveal()
            });
        },
        pay: function() {

        }
    };
};

class ShoshiNiKie extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'ready an ordinary character',
            cost: [shoshiNiKieCost()],
            target: {
                cardCondition: card => card.isOrdinary(),
                cardType: CardTypes.Character,
                player: Players.Self,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}

ShoshiNiKie.id = 'shoshi-ni-kie';

module.exports = ShoshiNiKie;
