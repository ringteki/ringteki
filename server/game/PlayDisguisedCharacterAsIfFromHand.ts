import AbilityContext = require('./AbilityContext');
import { PlayTypes } from './Constants';
import PlayDisguisedCharacterAction = require('./PlayDisguisedCharacterAction');
import DrawCard = require('./drawcard');
import Player = require('./player');

export class PlayDisguisedCharacterAsIfFromHand extends PlayDisguisedCharacterAction {
    constructor(card: DrawCard) {
        super(card, true);
    }

    createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}
