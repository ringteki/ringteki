const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { ConflictTypes, CardTypes, Players, TargetModes } = require('../../../Constants.js');

class ToGovernTheLand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home and bow based on bushi\'s power',
            condition: context => context.game.isDuringConflict(ConflictTypes.Political)
                && context.game.currentConflict.getParticipants().some(card => card.hasTrait('bushi') && card.controller === context.player),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                mode: TargetModes.Single,
                cardCondition: (card, context) => context.game.currentConflict.getParticipants().some(myCard =>
                    myCard.hasTrait('bushi')
                    && myCard.controller === context.player
                    && myCard.getMilitarySkill() > card.getMilitarySkill()
                ),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.bow()
                ])
            }
        });

        this.action({
            title: 'Send home and bow based on courtier\'s power',
            condition: context => context.game.isDuringConflict(ConflictTypes.Military)
                && context.game.currentConflict.getParticipants().some(card => card.hasTrait('courtier') && card.controller === context.player),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                mode: TargetModes.Single,
                cardCondition: (card, context) => context.game.currentConflict.getParticipants().some(myCard =>
                    myCard.hasTrait('courtier')
                    && myCard.controller === context.player
                    && myCard.getPoliticalSkill() > card.getPoliticalSkill()
                ),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.sendHome(),
                    AbilityDsl.actions.bow()
                ])
            }
        });
    }
}

ToGovernTheLand.id = 'to-govern-the-land';

module.exports = ToGovernTheLand;
