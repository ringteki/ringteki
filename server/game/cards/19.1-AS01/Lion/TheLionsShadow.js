const DrawCard = require('../../../drawcard.js');
const { Phases, AbilityTypes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const { context } = require('raven-js');

class TheLionsShadow extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 },
            trait: 'courtier'
        });

        this.persistentEffect({
            condition: context => context.game.currentPhase === Phases.Fate,
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            condition: context => context.source.parent.isDishonored,
            effect: AbilityDsl.effects.honorStatusDoesNotModifySkill()
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Look at 2 conflict cards and draw 1',
                cost: AbilityDsl.costs.dishonorSelf(),
                condition: context => context.source.isParticipating(),
                effect: 'look at the top two cards of their deck',
                gameAction: AbilityDsl.actions.deckSearch({
                    amount: 2,
                    placeOnBottomInRandomOrder: true,
                    shuffle: false,
                    reveal: false,
                    gameAction: AbilityDsl.actions.moveCard({
                        destination: Locations.Hand
                    }),
                })
            }),
        });
    }
}

TheLionsShadow.id = 'the-lion-s-shadow';

module.exports = TheLionsShadow;
