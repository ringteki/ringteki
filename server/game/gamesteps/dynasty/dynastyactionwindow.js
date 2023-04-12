const ActionWindow = require('../actionwindow.js');
const { EventNames, EffectNames } = require('../../Constants');
const { GameModes } = require('../../../GameModes.js');

class DynastyActionWindow extends ActionWindow {
    constructor(game) {
        super(game, 'Play cards from provinces', 'dynasty');
    }

    activePrompt() {
        let props = super.activePrompt();
        return {
            menuTitle: 'Click pass when done',
            buttons: props.buttons,
            promptTitle: this.title
        };
    }

    pass() {
        this.currentPlayer.passDynasty();
        if((!this.currentPlayer.opponent || !this.currentPlayer.opponent.passedDynasty) && this.game.gameMode !== GameModes.Skirmish) {
            this.game.addMessage('{0} is the first to pass, and gains 1 fate', this.currentPlayer);
            this.game.raiseEvent(EventNames.OnPassDuringDynasty, { player: this.currentPlayer, firstToPass: true }, event => event.player.modifyFate(1));
        } else {
            this.game.addMessage('{0} passes', this.currentPlayer);
            this.game.raiseEvent(EventNames.OnPassDuringDynasty, { player: this.currentPlayer, firstToPass: false });
        }
        if(!this.currentPlayer.opponent || this.currentPlayer.opponent.passedDynasty) {
            this.complete();
        } else {
            this.nextPlayer();
        }
    }

    nextPlayer() {
        if(this.currentPlayer.anyEffect(EffectNames.RestartDynastyPhase)) {
            let effectSource = this.currentPlayer.mostRecentEffect(EffectNames.RestartDynastyPhase);
            this.game.addMessage('The dynasty phase is ended due to the effects of {0}', effectSource);
            this.complete();
        } else if(this.currentPlayer.opponent && this.currentPlayer.opponent.anyEffect(EffectNames.RestartDynastyPhase)) {
            let effectSource = this.currentPlayer.mostRecentEffect(EffectNames.RestartDynastyPhase);
            this.game.addMessage('The dynasty phase is ended due to the effects of {0}', effectSource);
            this.complete();
        }

        let otherPlayer = this.currentPlayer.opponent;
        if(otherPlayer && !otherPlayer.passedDynasty) {
            this.currentPlayer = otherPlayer;
        }
    }
}

module.exports = DynastyActionWindow;
