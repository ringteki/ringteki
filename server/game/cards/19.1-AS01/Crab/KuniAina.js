const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class KuniAina extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            match: (card) =>
                card.type === CardTypes.Character &&
                (card.isTainted ||
                    card.hasTrait('shadowlands') ||
                    card.hasTrait('haunted')),
            effect: AbilityDsl.effects.modifyBothSkills(-2)
        });

        this.action({
            title: 'Taint a character',
            effect: 'identify the source of Crab\'s misfortune… it is {0}! {0} is tainted.',
            condition: (context) =>
                context.player.opponent &&
                context.player.hand.size() <=
                    context.player.opponent.hand.size(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }
}

KuniAina.id = 'kuni-aina';

module.exports = KuniAina;
