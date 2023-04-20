import AbilityContext = require('./AbilityContext');
import { PlayTypes } from './Constants';
import DrawCard = require('./drawcard');
import PlayCharacterAction = require('./playcharacteraction');
import Player = require('./player');

export class PlayCharacterAsIfFromHand extends PlayCharacterAction {
    constructor(card: DrawCard) {
        super(card, true);
    }

    public createContext(player: Player = this.card.controller) {
        const context = super.createContext(player);
        context.playType = PlayTypes.PlayFromHand;
        return context;
    }

    public meetsRequirements(context: AbilityContext, ignoredRequirements: string[] = []) {
        let newIgnoredRequirements = ignoredRequirements.includes('location')
            ? ignoredRequirements
            : ignoredRequirements.concat('location');
        return super.meetsRequirements(context, newIgnoredRequirements);
    }
}
