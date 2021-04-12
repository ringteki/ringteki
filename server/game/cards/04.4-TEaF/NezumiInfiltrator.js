const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class NezumiInfiltrator extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.immunity({
                    restricts: 'maho'
                }),
                AbilityDsl.effects.immunity({
                    restricts: 'shadowlands'
                })]
        }),
        this.reaction({
            title: 'Change attacked province\'s strength',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source && this.game.isDuringConflict()
            },
            max: AbilityDsl.limit.perConflict(1),
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
                        'Raise attacked province\'s strength by 1': '{0} chooses to increase {1}\'s strength by 1',
                        'Lower attacked province\'s strength by 1': '{0} chooses to reduce {1}\'s strength by 1'
                    },
                    choices: {
                        'Raise attacked province\'s strength by 1': AbilityDsl.actions.cardLastingEffect(() => ({
                            targetLocation: Locations.Provinces,
                            effect: AbilityDsl.effects.modifyProvinceStrength(1)
                        })),
                        'Lower attacked province\'s strength by 1': AbilityDsl.actions.cardLastingEffect(context => ({
                            targetLocation: Locations.Provinces,
                            effect: (
                                context.target.getStrength() > 1 ?
                                    AbilityDsl.effects.modifyProvinceStrength(-1) : []
                            )
                        }))
                    }
                }))
            }))
        });
    }
}

NezumiInfiltrator.id = 'nezumi-infiltrator';

module.exports = NezumiInfiltrator;
