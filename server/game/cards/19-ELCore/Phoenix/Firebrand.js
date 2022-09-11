const DrawCard = require('../../../drawcard.js');
const { TargetModes, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class Firebrand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant a character pride',
            condition: context => context.game.isDuringConflict('fire'),
            target: {
                mode: TargetModes.Single,
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.addKeyword('pride'),
                    duration: Durations.UntilEndOfConflict
                }))
            },
            effect: 'give {0} Pride until end of the conflict'
        });
    }
}

Firebrand.id = 'firebrand';

module.exports = Firebrand;
