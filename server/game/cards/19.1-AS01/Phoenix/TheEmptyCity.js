const ProvinceCard = require('../../../provincecard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const {
    TargetModes,
    CardTypes,
    Locations,
    Players,
    Durations
} = require('../../../Constants');

class TheEmptyCity extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Claim a ring',
            canTriggerOutsideConflict: true,
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: (card) => card.hasTrait('spirit')
            }),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: (ring) => ring.isUnclaimed(),
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.claimRing({
                        takeFate: false,
                        type: 'political'
                    }),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: AbilityDsl.effects.cardCannot(
                            'triggerAbilities'
                        ),
                        duration: Durations.UntilEndOfRound
                    }))
                ])
            },
            effect: 'claim {0} as a political ring'
        });

        this.action({
            title: 'Put a Spirit character into play',
            canTriggerOutsideConflict: true,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                location: [
                    Locations.ConflictDiscardPile,
                    Locations.DynastyDiscardPile
                ],
                cardCondition: (card) =>
                    card.hasTrait('spirit') && card.getCost() <= 2,
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.putIntoPlay(),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        target: context.source,
                        effect: AbilityDsl.effects.cardCannot(
                            'triggerAbilities'
                        ),
                        duration: Durations.UntilEndOfRound
                    }))
                ])
            },
            effect: 'put {0} into play'
        });
    }
}

TheEmptyCity.id = 'the-empty-city';

module.exports = TheEmptyCity;
