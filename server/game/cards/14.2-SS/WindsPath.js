const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const PlayCharacterAction = require('../../playcharacteraction');
const { CardTypes, Locations, PlayTypes } = require('../../Constants');

class WindsPathPlayAction extends PlayCharacterAction {
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


class WindsPath extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(),
            targetLocation: Locations.Provinces,
            match: (card, context) => card.type === CardTypes.Character && card.location === context.source.location && card.isFaceup(),
            effect: [
                AbilityDsl.effects.gainPlayAction(WindsPathPlayAction)
            ]
        });
    }
}

WindsPath.id = 'wind-s-path';

module.exports = WindsPath;
