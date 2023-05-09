import type Game = require('../game');

export class BaseStep {
    constructor(public game: Game) {}

    continue(): void {}

    onCardClicked(): boolean {
        return false;
    }

    onRingClicked(): boolean {
        return false;
    }

    onMenuCommand(): boolean {
        return false;
    }

    getDebugInfo(): string {
        return this.constructor.name;
    }
}
