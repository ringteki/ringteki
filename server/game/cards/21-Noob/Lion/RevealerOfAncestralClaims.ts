import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Locations, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class RevealerOfAncestralClaims extends DrawCard {
    static id = 'revealer-of-ancestral-claims';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
        });

        this.action({
            title: 'Increase or reduce the strength of a province',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.removeFateFromSelf(),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Increase Strength': AbilityDsl.actions.selectCard((context) => ({
                        activePromptTitle: 'Choose an attacked province',
                        hidePromptIfSingleCard: true,
                        cardType: CardTypes.Province,
                        location: Locations.Provinces,
                        cardCondition: (card) => card.isConflictProvince(),
                        message: '{0} increases the strength of {1}',
                        messageArgs: (cards) => [context.player, cards],
                        gameAction: AbilityDsl.actions.cardLastingEffect({
                            targetLocation: Locations.Provinces,
                            effect: AbilityDsl.effects.modifyProvinceStrength(4)
                        })
                    })),
                    'Reduce Strength': AbilityDsl.actions.selectCard((context) => ({
                        activePromptTitle: 'Choose an attacked province',
                        hidePromptIfSingleCard: true,
                        cardType: CardTypes.Province,
                        location: Locations.Provinces,
                        cardCondition: (card) => card.isConflictProvince(),
                        message: '{0} increases the strength of {1}',
                        messageArgs: (cards) => [context.player, cards],
                        gameAction: AbilityDsl.actions.cardLastingEffect({
                            targetLocation: Locations.Provinces,
                            effect: AbilityDsl.effects.modifyProvinceStrength(-4)
                        })
                    }))
                }
            }
        });
    }
}