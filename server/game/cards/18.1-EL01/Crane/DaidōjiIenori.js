const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players } = require('../../../Constants');

class DaidojiIenori extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Set a participating character to 1/1',
            condition: (context) => context.source.isParticipating() && context.source.isHonored,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: [
                        AbilityDsl.effects.setMilitarySkill(3),
                        AbilityDsl.effects.setPoliticalSkill(3)
                    ]
                })
            },
            effect: 'set the skills of {0} to 3{1}/3{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

DaidojiIenori.id = 'daidoji-ienori';

module.exports = DaidojiIenori;
