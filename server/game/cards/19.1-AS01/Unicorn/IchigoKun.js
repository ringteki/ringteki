const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, CardTypes, Players, TargetModes } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');

const elementKey = 'ichigo-kun-fire';

const choice = {
    moreMillLessGlory: 'Increase own military, reduce other glory',
    lessMilMoreGlory: 'Reduce own military, increase other glory'
};

class IchigoKun extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict &&
                context.game.currentConflict.hasElement(this.getCurrentElementSymbol(elementKey)),
            effect: AbilityDsl.effects.setBaseMilitarySkill(0)
        });

        this.action({
            title: 'Modify military skill and glory',
            targets: {
                otherCharacter: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card, context) => card.isParticipating() && card !== context.source
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'otherCharacter',
                    choices: (context) => ({
                        [choice.moreMillLessGlory]: this._ichigoActions(context, { military: +2, glory: -2 }),
                        [choice.lessMilMoreGlory]: this._ichigoActions(context, { military: -2, glory: +2 })
                    })
                }
            },
            effect: 'give {0} {1} {2} and {3} {4} glory - {0} {5}',
            effectArgs: (context) =>
                context.selects.select.choice === choice.moreMillLessGlory
                    ? ['+2', 'military', context.targets.otherCharacter, '-2', 'is wild today!']
                    : ['-2', 'military', context.targets.otherCharacter, '+2', 'is well-behaved. Impressive!']
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({ key: elementKey, prettyName: 'Restricted Ring', element: Elements.Fire });
        return symbols;
    }

    _ichigoActions(context, modifiers) {
        return AbilityDsl.actions.sequential([
            AbilityDsl.actions.moveToConflict({ target: context.source }),
            AbilityDsl.actions.multiple([
                AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    effect: AbilityDsl.effects.modifyMilitarySkill(modifiers.military)
                }),
                AbilityDsl.actions.cardLastingEffect({
                    target: context.targets.otherCharacter,
                    effect: AbilityDsl.effects.modifyGlory(modifiers.glory)
                })
            ])
        ]);
    }
}

IchigoKun.id = 'ichigo-kun';

module.exports = IchigoKun;
