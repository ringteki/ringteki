import { Clock, Mode } from './Clock';

export class Timer extends Clock {
    mode: Mode = 'down';
    name = 'Timer';

    protected timeRanOut() {
        this.player.game.addMessage("{0}'s timer has expired", this.player);
    }
}
