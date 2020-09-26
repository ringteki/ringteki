const _ = require('underscore');
const BaseStep = require('./basestep.js');
const uuid = require('uuid');

class UiPrompt extends BaseStep {
    constructor(game) {
        super(game);
        this.completed = false;
        this.uuid = uuid.v1();
    }

    isComplete() {
        return this.completed;
    }

    complete() {
        this.completed = true;
        if(this.getPlayer()) {
            this.getPlayer().stopClock();
        }
    }

    setPrompt() {
        _.each(this.game.getPlayers(), player => {
            if(this.activeCondition(player)) {
                player.setPrompt(this.addDefaultCommandToButtons(this.activePrompt(player)));
                player.startClock();
            } else {
                player.setPrompt(this.waitingPrompt());
                player.stopClock();
            }
        });
    }

    activeCondition(player) { // eslint-disable-line no-unused-vars
        return true;
    }

    activePrompt(player) { // eslint-disable-line no-unused-vars
    }

    addDefaultCommandToButtons(original) {
        var prompt = _.clone(original);
        if(prompt.buttons) {
            _.each(prompt.buttons, button => {
                button.command = button.command || 'menuButton';
                button.uuid = this.uuid;
            });
        }
        if(prompt.controls) {
            _.each(prompt.controls, controls => controls.uuid = this.uuid);
        }
        return prompt;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent' };
    }

    continue() {
        var completed = this.isComplete();

        if(completed) {
            this.clearPrompts();
        } else {
            this.setPrompt();
        }

        return completed;
    }

    clearPrompts() {
        _.each(this.game.getPlayers(), player => {
            player.cancelPrompt();
        });
    }

    onMenuCommand(player, arg, uuid, method) {
        if(!this.activeCondition(player) || uuid !== this.uuid) {
            return false;
        }

        return this.menuCommand(player, arg, method);
    }

    menuCommand(player, arg, method) { // eslint-disable-line no-unused-vars
        return true;
    }
    
    getPlayer() {
        return undefined;
    }
}

module.exports = UiPrompt;
