const DrawCard = require('../../drawcard.js');
const { Phases, Players, CardTypes, TargetModes } = require('../../Constants');

class HigesSermon extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow characters',
            phase: Phases.Draw,
            condition: context => context.player.cardsInPlay.any(a => !a.bowed) && context.player.opponent && context.player.opponent.cardsInPlay.any(a => !a.bowed),
            handler: context => {
                this.game.promptForSelect(context.player.firstPlayer ? context.player : context.player.opponent, {
                    mode: TargetModes.Single,
                    activePrompt: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: context.player.firstPlayer ? Players.Opponent : Players.Self,
                    context: context,
                    targets: true,
                    cardCondition: card => card.allowGameAction('bow', context),
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} bows {1}', player, cards);
                        this.game.applyGameAction(context, { bow: cards });
                        return true;
                    }
                });
                this.game.promptForSelect(context.player.firstPlayer ? context.player.opponent : context.player, {
                    mode: TargetModes.Single,
                    activePrompt: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: context.player.firstPlayer ? Players.Self : Players.Opponent,
                    context: context,
                    targets: true,
                    cardCondition: card => card.allowGameAction('bow', context),
                    onSelect: (player, cards) => {
                        this.game.addMessage('{0} bows {1}', player, cards);
                        this.game.applyGameAction(context, { bow: cards });
                        return true;
                    }
                });
            }
        });
    }
}

HigesSermon.id = 'hige-s-sermon';

module.exports = HigesSermon;


