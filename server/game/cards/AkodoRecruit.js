const DrawCard = require('../drawcard.js');
const { Locations, CardTypes } = require('../Constants');

class AkodoRecruit extends DrawCard {
    constructor(facedownCard) {
        super(facedownCard.owner, {
            clan: 'lion',
            cost: null,
            glory: 1,
            id: 'akodo-recruit',
            military: 1,
            name: 'Akodo Recruit',
            political: 0,
            side: 'dynasty',
            text: '',
            type: CardTypes.Character,
            traits: ['peasant'],
            is_unique: false
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, Locations.DynastyDiscardPile);
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let summary = super.getSummary(activePlayer, hideWhenFaceup);
        let tokenProps = { isToken: true };
        if (activePlayer === this.controller) {
            tokenProps.id = this.facedownCard.cardData.id;
        }
        return Object.assign(summary, tokenProps);
    }
}

module.exports = AkodoRecruit;
