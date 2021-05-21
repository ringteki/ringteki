const DrawCard = require('../../drawcard.js');
const { CardTypes, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class BetrayedVision extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Make a character a copy',
            condition: context => context.game.isDuringConflict(),
            targets: {
                cardToCopy: {
                    activePromptTitle: 'Choose a character to copy',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: card => !card.isUnique()
                },
                myCharacter: {
                    dependsOn: 'cardToCopy',
                    activePromptTitle: 'Choose a character to turn into the copy',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card, context) => card.isParticipating() && card !== context.targets.cardToCopy,
                    gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.copyCharacter(context.targets.cardToCopy)
                    }))
                }
            },
            effect: 'make {1} into a copy of {2}',
            effectArgs: context => [context.targets.myCharacter, context.targets.cardToCopy]
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

BetrayedVision.id = 'betrayed-vision';

module.exports = BetrayedVision;
