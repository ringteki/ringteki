const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, TargetModes, CardTypes } = require('../../Constants');

class NegotiationTable extends DrawCard {
    setupCardAbilities() {
        this.selectedChoices = [];
        this.action({
            title: 'Make opponent pick from several options',
            target: {
                mode: TargetModes.Select,
                player: Players.Opponent,
                choices: this.getChoices()
            },
            effect: '{1}',
            effectArgs: context => this.getMesssage(context.select.toLowerCase()),
            then: context => {
                this.selectedChoices.push(context.select.toLowerCase());
                if (context.select.toLowerCase() === 'done') {
                    this.selectedChoices = [];
                    return true;
                }
                return {
                    target: {
                        mode: TargetModes.Select,
                        choices: this.getChoices()
                    },
                    then: context => {
                        this.selectedChoices.push(context.select.toLowerCase());
                        if (context.select.toLowerCase() === 'done') {
                            this.selectedChoices = [];
                            return true;
                        }
                        return {
                            target: {
                                mode: TargetModes.Select,
                                choices: this.getChoices()
                            },
                            then: context => {
                                this.selectedChoices.push(context.select.toLowerCase());
                                if (context.select.toLowerCase() === 'done') {
                                    this.selectedChoices = [];
                                    return true;
                                }
                                return {
                                    target: {
                                        mode: TargetModes.Select,
                                        choices: this.getChoices()
                                    },
                                    then: context => {
                                        this.selectedChoices.push(context.select.toLowerCase());
                                        if (context.select.toLowerCase() === 'done') {
                                            this.selectedChoices = [];
                                            return true;
                                        }
                                        return {
                                            target: {
                                                mode: TargetModes.Select,
                                                choices: this.getChoices()
                                            }
                                        };
                                    }
                                };
                            }
                        };
                    }
                }
            }
        });
    }

    getDrawChoice() {
        return AbilityDsl.actions.sequential([
            AbilityDsl.actions.draw(context => ({
                target: context.player.opponent,
                amount: 1
            })),
            AbilityDsl.actions.draw(context => ({
                target: context.player,
                amount: 1
            }))
        ]);
    }

    getReadyChoice() {
        return AbilityDsl.actions.sequential([
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
        ]);
    }

    getFateChoice() {
        return AbilityDsl.actions.sequential([
            AbilityDsl.actions.gainFate(context => ({
                target: context.player.opponent,
                amount: 1
            })),
            AbilityDsl.actions.gainFate(context => ({
                target: context.player,
                amount: 1
            }))
        ]);   
    }

    getDoneChoice() {
        return AbilityDsl.actions.noAction();
    }

    getChoices() {
        return {
            'Draw 1 card': AbilityDsl.actions.conditional({
                condition: () => !this.selectedChoices.includes('draw 1 card'),
                trueGameAction: this.getDrawChoice(),
                falseGameAction: AbilityDsl.actions.draw( { amount: 0 })
            }),
            'Choose and ready a character': AbilityDsl.actions.conditional({
                condition: () => !this.selectedChoices.includes('choose and ready a character'),
                trueGameAction: this.getReadyChoice(),
                falseGameAction: AbilityDsl.actions.draw( { amount: 0 })
            }),
            'Gain 1 fate': AbilityDsl.actions.conditional({
                condition: () => !this.selectedChoices.includes('gain 1 fate'),
                trueGameAction: this.getFateChoice(),
                falseGameAction: AbilityDsl.actions.draw( { amount: 0 })
            }),
            'Done': this.getDoneChoice()
        };       
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

