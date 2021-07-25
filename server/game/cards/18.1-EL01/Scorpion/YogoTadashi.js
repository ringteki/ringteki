const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players } = require('../../../Constants.js');

class YogoTadashi extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            when: {
                onCardPlayed: (event, context) => event.player === context.player && event.card.hasTrait('poison') && context.game.isDuringConflict()
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.target,
                        effect: AbilityDsl.effects.modifyBothSkills(-1)
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        target: context.source,
                        effect: AbilityDsl.effects.modifyBothSkills(1)
                    }))
                ])
            },
            gameAction: AbilityDsl.actions.draw(),
            limit: AbilityDsl.limit.perRound(2),
            effect: 'give {0} -1{1}/-1{2} and {3} +1{1}/+1{2}',
            effectArgs: context => ['military', 'political', context.source]
        });
    }
}

YogoTadashi.id = 'yogo-tadashi';
module.exports = YogoTadashi;
