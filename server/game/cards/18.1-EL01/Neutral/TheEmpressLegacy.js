const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class TheEmpressLegacy extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: target => target.type === CardTypes.Character && !target.isFaction('neutral'),
                match: (card, source) => card === source
            })
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'target',
                restricts: 'cardEffects',
                source: this
            })
        });

        this.action({
            title: 'Claim the imperial favor',
            cost: AbilityDsl.costs.sacrificeSelf(),
            max: AbilityDsl.limit.perRound(1),
            gameAction: AbilityDsl.actions.claimImperialFavor(context => ({
                target: context.player
            }))
        });
    }
}

TheEmpressLegacy.id = 'the-empress-legacy';

module.exports = TheEmpressLegacy;


