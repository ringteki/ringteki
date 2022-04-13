const DrawCard = require('../../../drawcard.js');
const { CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class KakitasFirstKata extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Character doesn\'t bow during conflict resolution',
            condition: () => this.game.isDuringConflict('military'),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent && card.parent.isParticipating() && card.parent.controller === context.player && (card.parent.isFaction('crane') || card.parent.hasTrait('duelist'))
            }),
            gameAction: AbilityDsl.actions.multipleContext(context => {
                let target = context.costs && context.costs.bow && context.costs.bow.parent;
                if(target) {
                    let alone = target.isParticipatingFor(context.player) &&
                        this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1;
                    let actions = [
                        AbilityDsl.actions.cardLastingEffect({
                            target: target,
                            effect: AbilityDsl.effects.doesNotBow()
                        })
                    ];
                    if(alone) {
                        actions.push(AbilityDsl.actions.cardLastingEffect({
                            target: target,
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
                }
                return ({
                    gameActions: [AbilityDsl.actions.handler({ handler: () => true })]
                });
            }),
            effect: 'stop {1} from bowing during conflict resolution{2}',
            effectArgs: context => {
                if(context.costs.bow && context.costs.bow.parent) {
                    return [
                        context.costs.bow.parent,
                        context.costs.bow.parent.isParticipatingFor(context.player) && this.game.currentConflict.getNumberOfParticipantsFor(context.player) === 1 ?
                            ' and prevent opponents\' actions from bowing it' : ''
                    ];
                }
                return ['someone', ''];
            }
        });
    }
}

KakitasFirstKata.id = 'kakita-s-first-kata';

module.exports = KakitasFirstKata;
