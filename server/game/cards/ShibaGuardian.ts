import { CardTypes, Locations } from '../Constants';
import DrawCard from '../drawcard';
import type Player from '../player';

export class ShibaGuardian extends DrawCard {
    constructor(public facedownCard: DrawCard) {
        super(facedownCard.owner, {
            clan: 'phoenix',
            cost: null,
            glory: 1,
            id: 'shiba-guardian',
            military: 1,
            name: 'Shiba Guardian',
            political: 1,
            side: 'dynasty',
            text: '',
            type: CardTypes.Character,
            traits: ['bushi', 'yojimbo'],
            is_unique: false
        });
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, Locations.DynastyDiscardPile);
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer: Player, hideWhenFaceup: boolean) {
        const summary = super.getSummary(activePlayer, hideWhenFaceup);
        const tokenProps =
            activePlayer === this.controller
                ? { id: this.facedownCard.cardData.id as string, isToken: true }
                : { isToken: true };
        return Object.assign(summary, tokenProps);
    }
}
