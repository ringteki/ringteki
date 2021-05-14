const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Locations, CardTypes, Elements } = require('../../Constants');

class StewardOfCrypticLore extends DrawCard {
    setupCardAbilities() {
        this.dire({
            effect: AbilityDsl.effects.modifyPoliticalSkill(3)
        });

        this.action({
            title: 'Changes the strength of the attacked province',
            condition: context => context.game.isDuringConflict(this.getCurrentElementSymbol('steward-of-cryptic-lore-earth')),
            effect: 'change the province strength of an attacked province',
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince(),
                subActionProperties: card => {
                    context.target = card;
                    return ({ target: card });
                },
                gameAction: AbilityDsl.actions.chooseAction(() => ({
                    messages: {
                        'Raise attacked province\'s strength by 3': '{0} chooses to increase {1}\'s strength by 3',
                        'Lower attacked province\'s strength by 3': '{0} chooses to reduce {1}\'s strength by 3'
                    },
                    choices: {
                        'Raise attacked province\'s strength by 3': AbilityDsl.actions.cardLastingEffect(() => ({
                            targetLocation: Locations.Provinces,
                            effect: AbilityDsl.effects.modifyProvinceStrength(3)
                        })),
                        'Lower attacked province\'s strength by 3': AbilityDsl.actions.cardLastingEffect(() => ({
                            targetLocation: Locations.Provinces,
                            effect: AbilityDsl.effects.modifyProvinceStrength(-3)
                        }))
                    }
                }))
            }))
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: 'steward-of-cryptic-lore-earth',
            prettyName: 'Conflict Type',
            element: Elements.Earth
        });
        return symbols;
    }
}

StewardOfCrypticLore.id = 'steward-of-cryptic-lore';

module.exports = StewardOfCrypticLore;

