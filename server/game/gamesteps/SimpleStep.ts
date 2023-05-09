import type Game = require('../game');
import { BaseStep } from './BaseStep';

export class SimpleStep extends BaseStep {
    constructor(game: Game, public continueFunc: () => void) {
        super(game);
    }

    continue() {
        return this.continueFunc();
    }

    getDebugInfo() {
        return this.continueFunc.toString();
    }
}
