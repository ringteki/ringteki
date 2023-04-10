const DrawCard = require('../../../drawcard.js');
const { AbilityTypes, CardTypes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class DesperateAide extends DrawCard {
    setupCardAbilities() {
        this.composure({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Draw a card',
                condition: (context) => context.source.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.draw((context) => ({ target: context.player })),
                    AbilityDsl.actions.gainHonor((context) => ({
                        amount: this._aideControllerHasHigherPol(context) ? 1 : 0,
                        target: context.player
                    }))
                ]),
                effect: 'draw 1 card{1}',
                effectArgs: (context) => [this._aideControllerHasHigherPol(context) ? ' and gain 1 honor' : '']
            })
        });
    }

    _aideControllerHasHigherPol(context) {
        if(!context.player.opponent) {
            return true;
        }
        return this._aideCurrentPolSkill(context.player) > this._aideCurrentPolSkill(context.player.opponent);
    }

    _aideCurrentPolSkill(player) {
        return player.cardsInPlay.reduce(
            (total, card) =>
                card.type === CardTypes.Character && card.isParticipating() ? total + card.politicalSkill : total,
            0
        );
    }
}

DesperateAide.id = 'desperate-aide';

module.exports = DesperateAide;
