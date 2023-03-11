const DrawCard = require('../../../drawcard.js');
const { CardTypes, AbilityTypes, Locations, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class ShibasOath extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            cardCondition: (card) => card.hasTrait('bushi')
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === Phases.Conflict,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.reaction({
            title: 'Honor attached character',
            when: {
                onCardAttached: (event, context) =>
                    event.card === context.source && event.originalLocation !== Locations.PlayArea
            },
            gameAction: AbilityDsl.actions.honor((context) => ({
                target: context.source.parent
            })),
            effect: 'honor {1}',
            effectArgs: (context) => context.source.parent
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.WouldInterrupt, {
                title: 'Cancel an ability',
                when: {
                    onInitiateAbilityEffects: (event, context) =>
                        event.cardTargets.some(
                            (card) =>
                                // In play
                                card.location === Locations.PlayArea &&
                                // Character
                                card.getType() === CardTypes.Character &&
                                // Friendly
                                card.controller === context.player &&
                                // Not a Bushi
                                !card.hasTrait('bushi')
                        )
                },
                cost: AbilityDsl.costs.sacrificeSelf(),
                gameAction: AbilityDsl.actions.cancel(),
                effect: 'cancel the effects of {1}',
                effectArgs: (context) => [context.event.card]
            })
        });
    }
}

ShibasOath.id = 'shiba-s-oath';

module.exports = ShibasOath;
