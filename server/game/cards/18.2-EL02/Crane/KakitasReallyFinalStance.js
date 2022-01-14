const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class KakitasReallyFinalStance extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Character doesn\'t bow during conflict resolution',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.multipleContext(context => {
                    let alone = context.target.isParticipatingFor(context.player) &&
                        this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1;
                    let actions = [
                        AbilityDsl.actions.cardLastingEffect({
                            effect: AbilityDsl.effects.doesNotBow()
                        })
                    ];
                    if(alone) {
                        actions.push(AbilityDsl.actions.cardLastingEffect({
                            effect: AbilityDsl.effects.cardCannot({
                                cannot: 'bow',
                                restricts: 'opponentsCardEffects',
                                applyingPlayer: context.player
                            })
                        }));
                    }
                    return ({
                        gameActions: actions
                    });
                })
            },
            effect: 'stop {0} from bowing during conflict resolution{1}',
            effectArgs: context => [
                context.target.isParticipatingFor(context.player) && this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 ?
                    ' and prevent opponents\' actions from bowing it' : ''
            ]
        });
    }
}

KakitasReallyFinalStance.id = 'kakita-s-really-really-final-stance';

module.exports = KakitasReallyFinalStance;
