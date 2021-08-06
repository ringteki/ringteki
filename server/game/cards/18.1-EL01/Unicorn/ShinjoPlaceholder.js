const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations } = require('../../../Constants.js');

class ShinjoPlaceholder extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isParticipating(),
            targets: {
                character: {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    location: Locations.PlayArea,
                    cardCondition: (card, context) => card.isParticipating() && card.allowGameAction('bow', context)
                },
                province: {
                    activePromptTitle: 'Choose a province to reveal',
                    cardType: CardTypes.Province,
                    controller: Players.Self,
                    location: Locations.Provinces,
                    cardCondition: (card, context) => card.isFacedown() && card.allowGameAction('reveal', context)
                }
            },
            gameAction: AbilityDsl.actions.conditional({
                condition: context => context.targets.character.getMilitarySkill() <= context.targets.province.getStrength(),
                trueGameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.bow(context => ({
                        target: context.targets.character
                    })),
                    AbilityDsl.actions.reveal(context => ({
                        target: context.targets.province
                    }))
                ]),
                falseGameAction: AbilityDsl.actions.reveal(context => ({
                    target: context.targets.province
                }))
            }),
            effect: 'reveal {1} and {2}bow {3}',
            effectArgs: context => [
                context.targets.province,
                context.targets.character.getMilitarySkill() <= context.targets.province.getStrength() ? '' : 'fail to ',
                context.targets.character
            ]
        });
    }
}

ShinjoPlaceholder.id = 'shinjo-placeholder';
module.exports = ShinjoPlaceholder;
