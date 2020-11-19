const DrawCard = require('../drawcard.js');
const { CardTypes } = require('../Constants');

class BattlefieldAttachment extends DrawCard {
    unbrokenOnly() {
        return true;
    }

    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 }
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && (!this.unbrokenOnly() || !source.isBroken) && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        if(this.unbrokenOnly() && parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

module.exports = BattlefieldAttachment;

