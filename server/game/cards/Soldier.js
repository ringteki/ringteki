const DrawCard = require('../drawcard.js');
const { Locations, CardTypes } = require('../Constants');

class Soldier extends DrawCard {
    constructor(facedownCard) {
        super(facedownCard.owner, {
            clan: 'neutral',
            cost: null,
            glory: null,
            id: 'soldier',
            military: null,
            military_bonus: '+1',
            political_bonus: '+1',
            name: 'Soldier',
            political: null,
            side: 'conflict',
            text: '',
            type: CardTypes.Attachment,
            traits: ['follower'],
            is_unique: false
        });
        this.facedownCard = facedownCard;
    }

    leavesPlay() {
        this.owner.moveCard(this.facedownCard, Locations.ConflictDiscardPile);
        this.game.queueSimpleStep(() => {
            this.owner.removeCardFromPile(this);
            this.game.allCards = this.owner.removeCardByUuid(this.game.allCards, this.uuid);
        });
        super.leavesPlay();
    }

    getSummary(activePlayer, hideWhenFaceup) {
        let summary = super.getSummary(activePlayer, hideWhenFaceup);
        let tokenProps = { isToken: true };
        if(activePlayer === this.controller) {
            tokenProps.id = this.facedownCard.cardData.id;
        }
        return Object.assign(summary, tokenProps);
    }
}

module.exports = Soldier;
