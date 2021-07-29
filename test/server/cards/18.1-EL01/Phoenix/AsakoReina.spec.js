const DrawCard = require('../../drawcard.js');
const { Players, CardTypes, Elements } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const { IfAbleAction } = require('../../GameActions/IfAbleAction.js');
const elementKeys = {
    air: 'asako-reina-air',
    earth: 'asako-reina-earth',
    fire: 'asako-reina-fire',
    water: 'asako-reina-water',
    void: 'asako-reina-void'
};

class AsakoReina extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain boons based based on your currently claimed rings',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.gainHonor(
                    context =>
                    ({
                        condition: context.game.rings[this.getCurrentElementSymbol(elementKeys.air)].isConsideredClaimed(context.player),
                        amount: 1
                    })
                ),
                AbilityDsl.actions.draw(
                    context => ({
                        condition: context.game.rings[this.getCurrentElementSymbol(elementKeys.earth)].isConsideredClaimed(context.player),
                        amount: 1
                    })
                ),
                AbilityDsl.actions.gainFate(
                    context => ({
                        condition: context.game.rings[this.getCurrentElementSymbol(elementKeys.void)].isConsideredClaimed(context.player),
                        amount: 1
                    })
                ),
                AbilityDsl.actions.selectCard(
                    context => ({
                        activePromptTitle: 'Choose a 2 cost or lower character to ready',
                        condition: context.game.rings[this.getCurrentElementSymbol(elementKeys.water)].isConsideredClaimed(context.player),
                        cardCondition: card => card.costLessThan(3),
                        cardType: CardTypes.Character,
                        optional: false,
                        gameAction: AbilityDsl.actions.ready(),
                        targets: false,
                        message: '{0} chooses to ready {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })
                ),
                AbilityDsl.actions.selectCard(
                    context => ({
                        activePromptTitle: 'Choose a character to honor',
                        condition: context.game.rings[this.getCurrentElementSymbol(elementKeys.fire)].isConsideredClaimed(context.player),
                        cardType: CardTypes.Character,
                        optional: false,
                        gameAction: AbilityDsl.actions.honor(),
                        targets: false,
                        message: '{0} chooses to honor {1} with {2}\'s effect',
                        messageArgs: (card, player) => [player, card, context.source]
                    })
                ),

            ])
        });
    }
    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKeys.air,
            prettyName: '+1 honor',
            element: Elements.Air
        });
        symbols.push({
            key: elementKeys.earth,
            prettyName: 'draw a card',
            element: Elements.Earth
        });
        symbols.push({
            key: elementKeys.fire,
            prettyName: 'honor a character',
            element: Elements.Fire
        });

        symbols.push({
            key: elementKeys.water,
            prettyName: 'ready a 2 cost or less character',
            element: Elements.Water
        });

        symbols.push({
            key: elementKeys.void,
            prettyName: '+1 fate',
            element: Elements.Void
        });
        return symbols;
    }
}

AsakoReina.id = 'asako-reina';
module.exports = AsakoReina;
