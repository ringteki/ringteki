const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, TargetModes, Durations } = require('../../../Constants.js');

class InLadyDojisService extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Pacify a character',
            max: AbilityDsl.limit.perRound(1),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Character
            }),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Any
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    choices: {
                        'Prevent Attacking': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            duration: Durations.UntilEndOfPhase,
                            effect: [
                                AbilityDsl.effects.cardCannot('declareAsAttacker')
                            ]
                        })),
                        'Prevent Defending': AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.targets.character,
                            duration: Durations.UntilEndOfPhase,
                            effect: [
                                AbilityDsl.effects.cardCannot('declareAsDefender')
                            ]
                        }))
                    }
                }
            },
            effect: 'prevent {1} from being declared as {2} this phase',
            effectArgs: context => [context.targets.character, context.selects.select.choice === 'Prevent Attacking' ? 'an attacker' : 'a defender']
        });
    }

    canPlay(context, playType) {
        if(context.game.isDuringConflict()) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

InLadyDojisService.id = 'in-lady-doji-s-service';

module.exports = InLadyDojisService;


