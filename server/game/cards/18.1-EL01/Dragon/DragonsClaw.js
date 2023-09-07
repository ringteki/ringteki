const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants.js');

class DragonsClaw extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a participating character with lower military skill',
            cost: AbilityDsl.costs.bowSelf(),
            condition: (context) =>
                context.game.isDuringConflict() &&
                context.source.parent &&
                context.source.parent.attachments.some((a) => a.name === 'Dragon\'s Fang'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card, context) =>
                    card.getMilitarySkill() < context.source.parent.getMilitarySkill() && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([AbilityDsl.actions.bow(), AbilityDsl.actions.sendHome()])
            }
        });
    }
}

DragonsClaw.id = 'dragon-s-claw';
module.exports = DragonsClaw;
