const Clock = require('./Clock');

class ChessClock extends Clock {
    constructor(player, time) {
        super(player, time, 5);
        this.mode = 'stop';
        this.name = 'Chess Clock';
        this.stopTime = -1;
    }

    start() {
        if (this.mode !== 'down') {
            this.mode = 'down';
            super.start();
        } else {
            let diff = Math.floor(((Date.now() - this.timerStart) / 1000) + 0.5);
            this.updateDelayLeft(diff);
            if (this.delayToStartClock <= 0) {
                this.updateTimeLeft(diff, true);
            }
        }
    }

    stop() {
        super.stop();
        this.mode = 'stop';
    }

    opponentStart() {

    }

    timeRanOut() {
        this.player.game.addMessage('{0}\'s clock has run out', this.player);
        if(this.player.opponent && this.player.opponent.clock.timeLeft > 0) {
            this.player.game.recordWinner(this.player.opponent, 'clock');
        }
    }

    updateDelayLeft(secs) {
        if(secs < 0) {
            return;
        }

        this.delayToStartClock = this.baselineDelay - secs;
        if (this.delayToStartClock < 0) {
            this.delayToStartClock = 0;
        }
    }
}

module.exports = ChessClock;
