const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, CardTypes, Phases } = require('../../../Constants');

const captureParentCost = function() {
    return {
        action: { name: 'captureParentCost', getCostMessage: () => '' },
        canPay: function() {
            return true;
        },
        resolve: function(context) {
            context.costs.captureParentCost = context.source.parent;
        },
        pay: function() {
        }
    };
};

class DevelopingMasterpiece extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'ready',
                source: this
            })
        });

        this.action({
            title: 'Attach this to a character',
            phase: Phases.Draw,
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('crane') || card.hasTrait('courtier') || card.hasTrait('artisan')
            }),
            location: [Locations.Hand, Locations.ConflictDiscardPile],
            gameAction: AbilityDsl.actions.ifAble(context => ({
                ifAbleAction: AbilityDsl.actions.attach({
                    target: context.costs.bow,
                    attachment: context.source
                }),
                otherwiseAction: AbilityDsl.actions.discardCard({ target: context.source })
            }))
        });

        this.action({
            title: 'Gain honor',
            phase: Phases.Fate,
            condition: context => context.source.parent,
            cost: [
                captureParentCost(),
                AbilityDsl.costs.sacrificeSelf()
            ],
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                amount: context.costs.captureParentCost ? context.costs.captureParentCost.getGlory() : context.source.parent.getGlory(),
                target: context.player
            }))
        });
    }
}

DevelopingMasterpiece.id = 'developing-masterpiece';

module.exports = DevelopingMasterpiece;
