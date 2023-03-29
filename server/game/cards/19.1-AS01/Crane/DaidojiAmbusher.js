const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes } = require('../../../Constants');

class DaidojiAmbusher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give someone -2 military',
            condition: (context) => context.game.isDuringConflict('military') && context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                    }),
                    AbilityDsl.actions.conditional({
                        condition: (context) => this._ambusherDoFollowUp(context, false),
                        trueGameAction: AbilityDsl.actions.conditional({
                            condition: (context) => this._ambusherShouldDiscard(context),
                            trueGameAction: AbilityDsl.actions.discardFromPlay(),
                            falseGameAction: AbilityDsl.actions.removeFate()
                        }),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ])
            },
            effect: 'give {0} -2{1}{2}',
            effectArgs: (context) => [
                'military',
                this._ambusherDoFollowUp(context, true)
                    ? ` and ${this._ambusherShouldDiscard(context) ? 'discard them' : 'remove a fate from them'}`
                    : ''
            ]
        });
    }

    _ambusherDoFollowUp(context, preResolution) {
        const isDishonored = context.source.isDishonored;
        const targetZero = preResolution
            ? context.target.getMilitarySkill() <= 2
            : context.target.getMilitarySkill() === 0;

        return isDishonored && targetZero;
    }

    _ambusherShouldDiscard(context) {
        return context.target.getFate() === 0;
    }
}

DaidojiAmbusher.id = 'daidoji-ambusher';

module.exports = DaidojiAmbusher;
