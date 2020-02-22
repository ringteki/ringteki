const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, TargetModes, CardTypes } = require('../../Constants');

class NegotiationTable extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make opponent pick from several options',
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: {
                    'Draw 1 card': AbilityDsl.actions.sequential([
                        AbilityDsl.actions.draw(context => ({
                            target: context.player.opponent,
                            amount: 1
                        })),
                        AbilityDsl.actions.draw(context => ({
                            target: context.player,
                            amount: 1
                        }))
                    ]),
                    'Choose and ready a character': AbilityDsl.actions.sequential([
                        AbilityDsl.actions.selectCard(context => ({
                            player: Players.Opponent,
                            cardType: CardTypes.Character,
                            targets: true,
                            message: '{0} chooses to ready {1}',
                            messageArgs: card => [context.player.opponent, card],
                            gameAction: AbilityDsl.actions.ready()
                        })),
                        AbilityDsl.actions.selectCard(context => ({
                            player: Players.Self,
                            cardType: CardTypes.Character,
                            targets: true,
                            message: '{0} chooses to ready {1}',
                            messageArgs: card => [context.player, card],
                            gameAction: AbilityDsl.actions.ready()
                        })),
                    ]),
                    'Gain 1 fate': AbilityDsl.actions.sequential([
                        AbilityDsl.actions.gainFate(context => ({
                            target: context.player.opponent,
                            amount: 1
                        })),
                        AbilityDsl.actions.gainFate(context => ({
                            target: context.player,
                            amount: 1
                        }))
                    ]),
                    'Do nothing': AbilityDsl.actions.noAction()
            }},
            effect: '{1}',
            effectArgs: context => this.getMesssage(context.select.toLowerCase())
        });
    }

    getMesssage(choice) {
        if (choice === 'draw 1 card') {
            return 'have each player draw 1 card';
        }
        if (choice === 'choose and ready a character') {
            return 'have each player choose and ready a character';
        }
        if (choice === 'gain 1 fate') {
            return 'have each player gain 1 fate';
        }
        return 'do nothing';
    }
}

NegotiationTable.id = 'negotiation-table';

module.exports = NegotiationTable;

