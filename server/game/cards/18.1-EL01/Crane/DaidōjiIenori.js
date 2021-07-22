const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players } = require('../../../Constants');

class DaidojiIenori extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Set a participating character to 1/1',
            condition: () => this.game.isDuringConflict(),
            cost: AbilityDsl.costs.discardStatusToken({
                cardCondition: card => card.isHonored && card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: [
                        AbilityDsl.effects.setMilitarySkill(1),
                        AbilityDsl.effects.setPoliticalSkill(1)
                    ]
                })
            },
            effect: 'set the skills of {0} to 1{1}/1{2}',
            effectArgs: () => ['military', 'political']
        });
    }
}

DaidojiIenori.id = 'daidoji-ienori';

module.exports = DaidojiIenori;
