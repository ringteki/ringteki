const DrawCard = require('../../../drawcard.js');
const { ConflictTypes, TargetModes, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class CornerThePrey extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice followers to kill',
            condition: context => context.game.isDuringConflict(ConflictTypes.Military),
            cost: AbilityDsl.costs.sacrifice({
                cardType: [CardTypes.Character, CardTypes.Attachment],
                mode: TargetModes.Unlimited,
                cardCondition: card => card.hasTrait('follower') && (card.isParticipating() || (card.parent && card.parent.isParticipating()))
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card.printedCost <= this.getFollowerCount(context),
                gameAction: AbilityDsl.actions.discardFromPlay()
            },
            cannotTargetFirst: true
        });
    }

    getFollowerCount(context) {
        if(context.costs.sacrifice) {
            return context.costs.sacrifice.length;
        }
        const myFollowers = context.game.allCards.filter(card => card.controller === context.player && card.hasTrait('follower'));
        const myParticipatingFollowers = myFollowers.filter(card => card.isParticipating() || (card.parent && card.parent.isParticipating()));
        const amount = myParticipatingFollowers.length;
        return amount;
    }
}

CornerThePrey.id = 'corner-the-prey';

module.exports = CornerThePrey;
