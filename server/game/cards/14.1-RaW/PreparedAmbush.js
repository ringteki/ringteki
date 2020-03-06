const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { Locations, PlayTypes, CardTypes } = require('../../Constants');

class PreparedAmbushPlayAction extends PlayCharacterAction {
    constructor(card) {
        super(card, true);
    }

    createContext(player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context, ignoredRequirements = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location') ? ignoredRequirements : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}

class PreparedAmbush extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 }
        });

        this.persistentEffect({
            condition: context => context.game.isDuringConflict() && context.source.parent.isConflictProvince(),
            targetLocation: Locations.Provinces,
            match: card => card.isDynasty && !card.facedown,
            effect: AbilityDsl.effects.gainPlayAction(PreparedAmbushPlayAction)
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && !source.isBroken && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        if(parent.type === CardTypes.Province && parent.isBroken) {
            return false;
        }

        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

PreparedAmbush.id = 'prepared-ambush';

module.exports = PreparedAmbush;
