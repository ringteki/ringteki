const { UiPrompt } = require('./UiPrompt.js');
const { EventNames, Locations, Players, EffectNames } = require('../Constants');

class ActionWindow extends UiPrompt {
    constructor(game, title, windowName) {
        super(game);

        this.title = title;
        this.windowName = windowName;
        if(this.game.currentConflict && !this.game.currentConflict.isSinglePlayer) {
            this.currentPlayer = this.game.currentConflict.defendingPlayer;
        } else {
            this.currentPlayer = game.getFirstPlayer();
        }
        this.currentPlayerConsecutiveActions = 0;
        this.opportunityCounter = 0;
        this.prevPlayerPassed = false;
    }

    activeCondition(player) {
        return player === this.currentPlayer;
    }

    onCardClicked(player, card) {
        if(player !== this.currentPlayer) {
            return false;
        }

        let actions = card.getActions();

        let legalActions = actions.filter(action => action.meetsRequirements(action.createContext(player)) === '');

        if(legalActions.length === 0) {
            return false;
        } else if(legalActions.length === 1) {
            let action = legalActions[0];
            let targetPrompts = action.targets.some(target => target.properties.player !== Players.Opponent);
            if(!this.currentPlayer.optionSettings.confirmOneClick || action.cost.some(cost => cost.promptsPlayer) || targetPrompts) {
                this.resolveAbility(action.createContext(player));
                return true;
            }
        }
        this.game.promptWithHandlerMenu(player, {
            activePromptTitle: (card.location === Locations.PlayArea ? 'Choose an ability:' : 'Play ' + card.name + ':'),
            source: card,
            choices: legalActions.map(action => action.title).concat('Cancel'),
            handlers: legalActions.map(action => (() => this.resolveAbility(action.createContext(player)))).concat(() => true)
        });
        return true;
    }

    resolveAbility(context) {
        const resolver = this.game.resolveAbility(context);
        this.game.queueSimpleStep(() => {
            if(resolver.passPriority) {
                this.postResolutionUpdate(resolver);
            }
        });
    }

    postResolutionUpdate(resolver) { // eslint-disable-line no-unused-vars
        this.currentPlayerConsecutiveActions += 1;
        this.prevPlayerPassed = false;
        let allowableConsecutiveActions = this.currentPlayer.sumEffects(EffectNames.AdditionalAction);
        if (this.currentPlayer.actionPhasePriority) {
            if (allowableConsecutiveActions > 0) {
                allowableConsecutiveActions--;
            }
        }

        if(this.currentPlayerConsecutiveActions > allowableConsecutiveActions) {
            this.nextPlayer();
        }
    }

    continue() {
        if (this.currentPlayer.opponent) {
            if (this.currentPlayer.opponent.actionPhasePriority && this.currentPlayer.actionPhasePriority) {
                // Both players have action phase priority, don't do anything, it'll clear on its own
            } else if (this.currentPlayer.opponent.actionPhasePriority && !this.currentPlayer.actionPhasePriority) {
                this.currentPlayer = this.currentPlayer.opponent;
            } else if (this.currentPlayer.isDefendingPlayer()) {
                this.currentPlayer.actionPhasePriority = false;
            }
        } else {
            this.currentPlayer.actionPhasePriority = false;
        }

        if(!this.currentPlayer.promptedActionWindows[this.windowName]) {
            this.pass();
        }

        let completed = super.continue();

        if(!completed) {
            this.game.currentActionWindow = this;
        } else {
            this.game.currentActionWindow = null;
        }
        return completed;
    }

    activePrompt() {
        let buttons = [
            { text: 'Pass', arg: 'pass' }
        ];
        if(this.game.manualMode) {
            buttons.unshift({ text: 'Manual Action', arg: 'manual'});
        }
        return {
            menuTitle: 'Initiate an action',
            buttons: buttons,
            promptTitle: this.title
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to take an action or pass' };
    }

    menuCommand(player, choice) {
        if(choice === 'manual') {
            this.game.promptForSelect(this.currentPlayer, {
                source: 'Manual Action',
                activePrompt: 'Which ability are you using?',
                location: Locations.Any,
                controller: Players.Self,
                cardCondition: card => card.isFaceup(),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} uses {1}\'s ability', player, card);
                    this.prevPlayerPassed = false;
                    this.nextPlayer();
                    return true;
                }
            });
            return true;
        }

        if(choice === 'pass') {
            this.pass();
            return true;
        }
    }

    pass() {
        this.game.addMessage('{0} passes', this.currentPlayer);

        if(this.prevPlayerPassed || !this.currentPlayer.opponent) {
            this.complete();
        }

        this.currentPlayerConsecutiveActions += 1;
        let allowableConsecutiveActions = this.currentPlayer.sumEffects(EffectNames.AdditionalAction);
        if (this.currentPlayer.actionPhasePriority) {
            if (allowableConsecutiveActions > 0) {
                allowableConsecutiveActions--;
            }
        }
        if(this.currentPlayerConsecutiveActions > allowableConsecutiveActions) {
            this.prevPlayerPassed = true;
            this.nextPlayer();
        }
    }

    nextPlayer() {
        let otherPlayer = this.game.getOtherPlayer(this.currentPlayer);

        this.currentPlayer.actionPhasePriority = false;

        if(this.currentPlayer.anyEffect(EffectNames.ResolveConflictEarly)) {
            this.complete();
        }

        if(otherPlayer) {
            this.game.raiseEvent(
                EventNames.OnPassActionPhasePriority,
                { player: this.currentPlayer, consecutiveActions: this.currentPlayerConsecutiveActions, actionWindow: this },
                () => {
                    this.currentPlayer = otherPlayer;
                    this.opportunityCounter += 1;
                    this.currentPlayerConsecutiveActions = 0;
                }
            );
        }
    }
}

module.exports = ActionWindow;
