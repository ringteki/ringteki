import AbilityContext = require('../../../AbilityContext');
import { AbilityTypes, CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import Player = require('../../../player');

export default class DesperateAide extends DrawCard {
    static id = 'desperate-aide';

    public setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Draw a card',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.draw((context) => ({ target: context.player })),
                    AbilityDsl.actions.gainHonor((context) => ({
                        amount: this.controllerHasHigherPol(context) ? 1 : 0,
                        target: context.player
                    }))
                ]),
                effect: 'draw 1 card{1}',
                effectArgs: (context: AbilityContext) => [
                    this.controllerHasHigherPol(context) ? ' and gain 1 honor' : ''
                ]
            })
        });
    }

    private controllerHasHigherPol(context: AbilityContext): boolean {
        return (
            !context.player.opponent ||
            this.participatingPolSkillTotal(context.player) > this.participatingPolSkillTotal(context.player.opponent)
        );
    }

    private participatingPolSkillTotal(player: Player): number {
        return (player.cardsInPlay as BaseCard[]).reduce(
            (total, card) =>
                card.type === CardTypes.Character && card.isParticipating() ? total + card.politicalSkill : total,
            0
        );
    }
}
