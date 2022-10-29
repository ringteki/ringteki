const AbilityDsl = require('../../../abilitydsl.js');
const {
    CardTypes,
    Players,
    Locations,
    Elements
} = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');

const elementKey = 'mangrove-safehouse-water';

class MangroveSafehouse extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetLocation: Locations.Provinces,
            targetController: Players.Self,
            condition: (context) => {
                const currentRingToClaim =
                    this.getCurrentElementSymbol(elementKey);
                const youHaveNotClaimedTheRequiredRing = !this.game.rings[
                    currentRingToClaim
                ].isConsideredClaimed(context.player);
                return youHaveNotClaimedTheRequiredRing;
            },
            match: (card, context) => {
                const isAdjacentProvince = context.player.areLocationsAdjacent(
                    context.source.location,
                    card.location
                );
                return isAdjacentProvince;
            },
            effect: AbilityDsl.effects.modifyProvinceStrength(-1)
        });

        this.action({
            title: 'Move an attacker out of the conflict',
            effect: 'move {0} home{1}',
            effectArgs: (context) => [
                this.targetIsMantis(context) &&
                this.opponentHasFateToBeStolen(context)
                    ? ' and steal 1 fate'
                    : ''
            ],
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card) => card.isAttacking(),
                gameAction: AbilityDsl.actions.multipleContext((context) => {
                    if(this.targetIsMantis(context)) {
                        return {
                            gameActions: [
                                AbilityDsl.actions.sendHome(),
                                AbilityDsl.actions.takeFate({
                                    target: context.player.opponent
                                })
                            ]
                        };
                    }
                    return {
                        gameActions: [AbilityDsl.actions.sendHome()]
                    };
                })
            }
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Claimed Ring',
            element: Elements.Water
        });
        return symbols;
    }

    targetIsMantis(context) {
        return context.target.traits.some((trait) => trait === 'mantis-clan');
    }

    opponentHasFateToBeStolen(context) {
        return context.player.opponent.fate > 0;
    }
}

MangroveSafehouse.id = 'mangrove-safehouse';

module.exports = MangroveSafehouse;
