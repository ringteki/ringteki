const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { ConflictTypes, CardTypes, Players, Durations } = require('../../../Constants.js');

class Retribution extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Immediately declare a military conflict',
            when: {
                onConflictFinished: (event, context) => event.conflict.attackingPlayer === context.player.opponent && event.conflict.winner === context.player.opponent
            },
            effect: 'declare a military conflict, attacking with {1}',
            effectArgs: context => [context.target],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => {
                    const ringsArray = [this.game.rings.air, this.game.rings.earth, this.game.rings.fire, this.game.rings.void, this.game.rings.water];
                    const cardValid = card.isHonored || card.hasTrait('battle-maiden');
                    return cardValid && ringsArray.some(ring => ring.canDeclare(context.player) && card.canDeclareAsAttacker(ConflictTypes.Military, ring));
                },
                gameAction: AbilityDsl.actions.sequentialContext(context => {
                    const gameActions = [];
                    gameActions.push(AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfConflict,
                        effect: AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                        target: context.target
                    }));
                    gameActions.push(AbilityDsl.actions.cardLastingEffect({
                        duration: Durations.UntilEndOfConflict,
                        effect: [
                            AbilityDsl.effects.cardCannot('declareAsAttacker')
                        ],
                        target: context.player.cardsInPlay.filter(card => card.getType() === CardTypes.Character && card !== context.target)
                    }));
                    gameActions.push(AbilityDsl.actions.playerLastingEffect(() => ({
                        targetController: context.player,
                        duration: Durations.UntilEndOfPhase,
                        effect: AbilityDsl.effects.additionalConflict('military')
                    })));
                    gameActions.push(AbilityDsl.actions.initiateConflict({ target: context.player, canPass: false, forcedDeclaredType: ConflictTypes.Military }));

                    return { gameActions };
                })
            }
        });
    }
}

Retribution.id = 'retribution-';

module.exports = Retribution;


