const DrawCard = require('../../../drawcard.js');
const { AbilityTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class DesperateAide extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Draw a card',
                condition: context => context.source.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.draw(context => ({ target: context.player })),
                    AbilityDsl.actions.gainHonor(context => {
                        let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                        const winning = context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
                        return {
                            amount: winning ? 1 : 0,
                            target: context.player
                        };
                    })
                ]),
                effect: 'draw 1 card{1}',
                effectArgs: context => {
                    let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                    const winning = context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
                    return [winning ? ' and gain 1 honor' : ''];
                }
            })
        });
    }
}

DesperateAide.id = 'desperate-aide';

module.exports = DesperateAide;
