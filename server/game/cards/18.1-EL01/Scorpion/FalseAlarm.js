const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../../Constants.js');

class FalseAlarm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a Shinobi Home',
            condition: context => context.game.isDuringConflict() &&
                context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('shinobi') && context.game.actions.sendHome().canAffect(card, context)) &&
                context.player.opponent && context.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent) > 0,
            target: {
                activePromptTitle: 'Choose a Shinobi to send home',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.isParticipating() && card.hasTrait('shinobi') && context.game.actions.sendHome().canAffect(card, context)
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome(context => ({ target: context.target })),
                AbilityDsl.actions.conditional({
                    condition: context => {
                        const part = context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 0;
                        const poison = context.player.conflictDiscardPile.filter(card => card.hasTrait('poison')).length > 0;
                        return part && poison;
                    },
                    trueGameAction: AbilityDsl.actions.selectCard(context => ({
                        activePromptTitle: 'Choose a poison',
                        cardType: [CardTypes.Attachment, CardTypes.Event, CardTypes.Character],
                        controller: Players.Self,
                        location: Locations.ConflictDiscardPile,
                        targest: true,
                        cardCondition: card => card.hasTrait('poison'),
                        message: '{0} returns {1} to their hand',
                        messageArgs: cards => [context.player, cards],
                        gameAction: AbilityDsl.actions.moveCard(() => ({
                            destination: Locations.Hand
                        }))
                    })),
                    falseGameAction: AbilityDsl.actions.handler({ handler: () => true })
                })
            ]),
            effect: 'send {1} home{2}',
            effectArgs: context => [
                context.target,
                (context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 &&
                    context.player.conflictDiscardPile.filter(card => card.hasTrait('poison')).length > 0) ? ' and return a Poison to their hand' : ''
            ]
        });
    }
}

FalseAlarm.id = 'false-alarm';
module.exports = FalseAlarm;
