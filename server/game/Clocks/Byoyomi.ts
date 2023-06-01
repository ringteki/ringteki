import type Player from '../player';
import { ChessClock } from './ChessClock';

export class Byoyomi extends ChessClock {
    name = 'Byoyomi';

    constructor(player: Player, time: number, public periods: number, public timePeriod: number) {
        super(player, time);
        this.timeLeft = time + periods * timePeriod;
    }

    protected reset() {
        if (this.timeLeft > 0 && this.timeLeft < this.periods * this.timePeriod) {
            this.periods = Math.ceil(this.timeLeft / this.timePeriod);
            this.timeLeft = this.periods * this.timePeriod;
        }
    }

    getState() {
        const state = super.getState();
        return Object.assign(
            {
                periods: this.periods,
                timePeriod: this.timePeriod
            },
            state
        );
    }
}
