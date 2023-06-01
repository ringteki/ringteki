import { ChessClock } from './ChessClock';

export class Hourglass extends ChessClock {
    name = 'Hourglass';

    protected opponentStart() {
        this.mode = 'up';
        super.opponentStart();
    }
}
