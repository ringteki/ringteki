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
                    message: '{4} sets the skills of {0} to {3}{1}/{3}{2}',
                    messageArgs: card => [context.target, 'military', 'political', card.getStrength(), context.source],
                    cardCondition: card => card.isConflictProvince(),
                    subActionProperties: card => {
                        context.targets.province = card;
                        return ({
                            target: context.target,
                            effect: [
                                AbilityDsl.effects.setMilitarySkill(card.getStrength()),
                                AbilityDsl.effects.setPoliticalSkill(card.getStrength())
                            ]
                        });
                    },
                    gameAction: AbilityDsl.actions.cardLastingEffect({

                    })
                }))
            },
            effect: 'set the skills of {0} to the strength of an attacked province'
        });
    }
}

ShinjoAtagi.id = 'shinjo-atagi';
module.exports = ShinjoAtagi;
