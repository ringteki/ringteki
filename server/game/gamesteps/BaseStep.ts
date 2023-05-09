import type BaseCard = require('../basecard');
import type Game = require('../game');
import type Player = require('../player');
import type Ring = require('../ring');
import type { Step } from './Step';

export class BaseStep implements Step {
    constructor(public game: Game) {}

    continue() {
        return undefined;
    }

    onCardClicked(player: Player, card: BaseCard): boolean {
        return false;
    }

    onRingClicked(player: Player, ring: Ring): boolean {
        return false;
    }

    onMenuCommand(player: Player, arg: string, uuid: string, method: string): boolean {
        return false;
    }

    getDebugInfo(): string {
        return this.constructor.name;
    }
}
