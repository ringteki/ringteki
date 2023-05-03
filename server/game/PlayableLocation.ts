import type { Locations, PlayTypes } from './Constants';
import type BaseCard = require('./basecard');
import type Player = require('./player');

export class PlayableLocation {
    public constructor(
        public playingType: PlayTypes,
        private player: Player,
        private location: Locations,
        private cards = new Set<BaseCard>()
    ) {}

    public contains(card: BaseCard) {
        if (this.cards.size > 0 && !this.cards.has(card)) {
            return false;
        }

        return this.player.getSourceList(this.location).contains(card);
    }
}
