const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Locations, Players, CardTypes, TargetModes } = require('../../../Constants.js');

class Kuro extends DrawCard {
    allowAttachment(attachment) {
        if(attachment.printedCost < 1)
            return false;
        return super.allowAttachment(attachment);
    }

    setupCardAbilities() {
        this.action({
            title: 'Play opponent discarded attachment',
            condition: context => context.game.isDuringConflict(),
            target: {
                location: Locations.ConflictDiscardPile,
                controller: Players.Opponent,
                cardType: CardTypes.Attachment,
                mode: TargetModes.Single,
                cardCondition: card => card.printedCost >= 1,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.reduceNextPlayedCardCost(1)
                    })),
                    AbilityDsl.actions.playCard(context => ({
                        source: this,
                        payCosts: true,
                        target: context.target,
                        optional: false,
                        playCardTarget: attachContext => {
                            attachContext.target = context.source;
                            attachContext.targets.target = context.source;
                        }
                    })),
                    AbilityDsl.actions.conditional(conditionalContext => ({
                        condition: context => context.source.isParticipating(),
                        trueGameAction: AbilityDsl.actions.sendHome({ target: conditionalContext.source }),
                        falseGameAction: AbilityDsl.actions.moveToConflict({ target: conditionalContext.source })
                    }))
                ])
            },
            effect: 'seek the lost treasure \'{1}\'. {2}',
            effectArgs: context => [context.target, context.source.isParticipating() ? 'Kuro returns home with their treasure' : 'Kuro swoops into the conflict']
        });
    }
}

Kuro.id = 'kuro';

module.exports = Kuro;
