const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes } = require('../../../Constants');

class DaidojiAmbusher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give someone -2 military',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                    }),
                    AbilityDsl.actions.conditional({
                        condition: context => context.target.getFate() > 0,
                        trueGameAction: AbilityDsl.actions.removeFate(context => ({
                            target: this.checkCondition(context) ? context.target : []
                        })),
                        falseGameAction: AbilityDsl.actions.discardFromPlay(context => ({
                            target: this.checkCondition(context) ? context.target : []
                        }))
                    })
                ])
            },
            effect: 'give {0} -2{1}{2}{3}',
            effectArgs: context => [
                'military',
                this.checkCondition(context, true) ? ` and ${context.target.getFate() > 0 ? 'remove a fate from them' : 'discard them'}` : ''
            ],
        });
    }

    checkCondition(context, chat = false) {
        const isDishonored = context.source.isDishonored;
        const targetZero = context.target.getMilitarySkill() <= (chat ? 2 : 0);

        return isDishonored && targetZero;
    }
}

DaidojiAmbusher.id = 'daidoji-ambusher';

module.exports = DaidojiAmbusher;
