const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { ConflictTypes, CardTypes, Players, Durations, Locations } = require('../../../Constants.js');
const GameModes = require('../../../../GameModes.js');

class Retribution extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Immediately declare a military conflict',
            when: {
                onConflictFinished: (event, context) => this._retributionCondition(event, context)
            },
            effect: 'declare a military conflict, attacking with {1}',
            effectArgs: (context) => [context.target],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => this._retributionAttackerFilter(card, context),
                gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                    gameActions: [
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfConflict,
                            effect: AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                            target: context.target
                        }),
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfConflict,
                            effect: AbilityDsl.effects.cardCannot('declareAsAttacker'),
                            target: context.player.cardsInPlay.filter(
                                (card) => card.getType() === CardTypes.Character && card !== context.target
                            )
                        }),
                        AbilityDsl.actions.playerLastingEffect({
                            targetController: context.player,
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.additionalConflict('military')
                        }),
                        AbilityDsl.actions.initiateConflict({
                            target: context.player,
                            canPass: false,
                            forcedDeclaredType: ConflictTypes.Military
                        })
                    ]
                }))
            },
            limit: AbilityDsl.limit.perRound(1)
        });
    }

    _retributionCondition(event, context) {
        return (
            // Lost conflict as defender
            event.conflict.attackingPlayer === context.player.opponent &&
            event.conflict.winner === context.player.opponent &&
            // Equal or more broken provinces
            this._retributionBrokenProvincesForPlayer(context.player) >=
                this._retributionBrokenProvincesForPlayer(context.player.opponent)
        );
    }

    _retributionAttackerFilter(card, context) {
        return (
            // honored or battlemaiden
            (card.isHonored || card.hasTrait('battle-maiden')) &&
            // can attack military
            Object.values(this.game.rings).some(
                (ring) => ring.canDeclare(context.player) && card.canDeclareAsAttacker(ConflictTypes.Military, ring)
            )
        );
    }

    _retributionBrokenProvincesForPlayer(player) {
        const gameModeProvinceCount = this.game.gameMode === GameModes.Skirmish ? 4 : 5;
        const locations = [
            Locations.StrongholdProvince,
            Locations.ProvinceOne,
            Locations.ProvinceTwo,
            Locations.ProvinceThree,
            Locations.ProvinceFour
        ].slice(0, gameModeProvinceCount);
        return locations.reduce(
            (sum, location) => (player.getProvinceCardInProvince(location).isBroken ? sum + 1 : sum),
            0
        );
    }
}

Retribution.id = 'retribution-';

module.exports = Retribution;
