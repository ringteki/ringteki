const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, CardTypes, Phases, PlayTypes } = require('../../../Constants');

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
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker(),
                AbilityDsl.effects.cannotParticipateAsDefender()
            ]
        });

        this.persistentEffect({
            location: Locations.ConflictDiscardPile,
            effect: AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDiscardPile, [this], this, PlayTypes.Other)
        });

        this.action({
            title: 'Gain honor',
            phase: Phases.Fate,
            condition: context => context.source.parent,
            cost: [
                captureParentCost(),
                AbilityDsl.costs.removeSelfFromGame()
            ],
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                amount: context.costs.captureParentCost ? context.costs.captureParentCost.getGlory() : context.source.parent.getGlory(),
                target: context.player
            }))
        });
    }

    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }

        if(card.getType() === CardTypes.Character && (card.hasTrait('courtier') || card.hasTrait('artisan') || card.isFaction('crane'))) {
            return super.canAttach(card);
        }
        return false;
    }

    canPlay(context, playType) {
        if(context.game.currentPhase !== Phases.Draw) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

DevelopingMasterpiece.id = 'developing-masterpiece';

module.exports = DevelopingMasterpiece;
