const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, Players, CardTypes } = require('../../../Constants.js');

const elementKey = 'henshin-seeker-fire';

class HenshinSeeker extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.rings[this.getCurrentElementSymbol(elementKey)].isConsideredClaimed(context.player),
            match: card => card.getType() === CardTypes.Character,
            targetController: Players.Self,
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

HenshinSeeker.id = 'henshin-seeker';
module.exports = HenshinSeeker;
