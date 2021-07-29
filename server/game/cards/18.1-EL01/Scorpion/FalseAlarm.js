const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants.js');

class FalseAlarm extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a Shinobi Home',
            condition: context => context.game.isDuringConflict() && context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('shinobi') && context.game.actions.sendHome().canAffect(card, context)),
            targets: {
                shinobi: {
                    activePromptTitle: 'Choose a Shinobi to send home',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card.hasTrait('shinobi') && context.game.actions.sendHome().canAffect(card, context)
                },
                other: {
                    activePromptTitle: 'Choose a character to conditionally dishonor',
                    optional: true,
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && context.game.actions.dishonor().canAffect(card, context)
                }
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.sendHome(context => ({ target: context.targets.shinobi })),
                AbilityDsl.actions.dishonor(context => ({
                    target: context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 0 ? context.targets.other : []
                }))
            ]),
            effect: 'send {1} home{2}{3}',
            effectArgs: context => [
                context.targets.shinobi,
                context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 ? ' and dishonor ' : '',
                context.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 ? context.targets.other : ''
            ]
        });
    }
}

FalseAlarm.id = 'false-alarm';
module.exports = FalseAlarm;
