const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Elements } = require('../../Constants');

class HenshinDisciple extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context =>
                this.game.rings[this.getCurrentElementSymbol('henshin-disciple-air')].isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict(this.getCurrentElementSymbol('henshin-disciple-air')) && this.game.currentConflict.ring.isContested()),
            effect: AbilityDsl.effects.modifyPoliticalSkill(2)
        });
        this.persistentEffect({
            condition: context =>
                this.game.rings[this.getCurrentElementSymbol('henshin-disciple-earth')].isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict(this.getCurrentElementSymbol('henshin-disciple-earth')) && this.game.currentConflict.ring.isContested()),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
        this.persistentEffect({
            condition: context =>
                this.game.rings[this.getCurrentElementSymbol('henshin-disciple-fire')].isConsideredClaimed(context.player) ||
                (this.game.isDuringConflict(this.getCurrentElementSymbol('henshin-disciple-fire')) && this.game.currentConflict.ring.isContested()),
            effect: AbilityDsl.effects.addKeyword('pride')
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'henshin-disciple-air',
            prettyName: '+2 Political',
            element: Elements.Air
        });
        symbols.push({
            key: 'henshin-disciple-earth',
            prettyName: '+2 Military',
            element: Elements.Earth
        });
        symbols.push({
            key: 'henshin-disciple-fire',
            prettyName: 'Pride',
            element: Elements.Fire
        });
        return symbols;
    }
}

HenshinDisciple.id = 'henshin-disciple';

module.exports = HenshinDisciple;
