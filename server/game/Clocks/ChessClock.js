const Clock = require('./Clock');

class ChessClock extends Clock {
    constructor(player, time) {
        super(player, time, 5);
        this.mode = 'stop';
        this.name = 'Chess Clock';
    }

    pause() {
        this.stop();
    }

    restart() {
        this.start();
    }

    reset() {
        this.stop();
    }

    start() {
        if(!this.manuallyPaused) {
            if(this.mode !== 'down') {
                this.mode = 'down';
                super.start();
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

    updateTimeLeft(secs) {
        if(this.timeLeft === 0 || secs < 0) {
            return;
        }
        if(secs <= this.delayToStartClock) {
            return;
        }

        secs = secs - this.delayToStartClock;
        if(this.mode === 'down') {
            this.modify(-secs);
            if(this.timeLeft < 0) {
                this.timeLeft = 0;
                this.timeRanOut();
            }
        } else if(this.mode === 'up') {
            this.modify(secs);
        }
    }

}

module.exports = ChessClock;
