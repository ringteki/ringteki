const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../../Constants.js');

class ShinjoAtagi extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Set a participating character\'s skills',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose an attacked province',
                    hidePromptIfSingleCard: true,
                    cardType: CardTypes.Province,
                    location: Locations.Provinces,
                    message: '{3} sets the {1} skill of {0} to {2}{1}',
                    messageArgs: card => [context.target, context.game.currentConflict.conflictType, card.printedStrength, context.source],
                    cardCondition: card => card.isConflictProvince(),
                    subActionProperties: card => {
                        context.targets.province = card;
                        const effect = [];
                        if (context.game.currentConflict.conflictType === 'military') {
                            effect.push(AbilityDsl.effects.setMilitarySkill(card.printedStrength));
                        } else {
                            effect.push(AbilityDsl.effects.setPoliticalSkill(card.printedStrength));
                        }
                        return ({
                            target: context.target,
                            effect: effect
                        });
                    },
                    gameAction: AbilityDsl.actions.cardLastingEffect({

                    })
                }))
            },
            effect: 'set the {1} skill of {0} to the printed strength of an attacked province',
            effectArgs: context => [context.game.currentConflict.conflictType]
        });
    }
}

ShinjoAtagi.id = 'shinjo-atagi';
module.exports = ShinjoAtagi;
