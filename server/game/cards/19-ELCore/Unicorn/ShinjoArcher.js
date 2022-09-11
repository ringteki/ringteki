const DrawCard = require('../../../drawcard.js');
const { TargetModes, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class ShinjoArcher extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move home and give -2/-2',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.moveHomeSelf(),
            target: {
                mode: TargetModes.Single,
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyBothSkills(-2),
                    duration: Durations.UntilEndOfConflict
                }))
            },
            effect: 'make a parting shot, giving {0} -2{2}/-2{3}',
            effectArgs: context => [context.source, 'military', 'political']
        });
    }
}

ShinjoArcher.id = 'shinjo-archer';

module.exports = ShinjoArcher;
