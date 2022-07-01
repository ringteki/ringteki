const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes, TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class AkodoCho extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.bow({
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) => card.parent === context.source && card.hasTrait('follower')
            }),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: (card, context) => card.isParticipating() && context.game.actions.bow().canAffect(card, context)
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Discard an attachment from this character': AbilityDsl.actions.selectCard(context => ({
                            cardType: CardTypes.Attachment,
                            effect: 'discard an attachment on {0}',
                            effectArgs: context => [context.targets.character],
                            player: context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                            activePromptTitle: 'Choose an attachment to discard',
                            cardCondition: card => card.parent === context.targets.character,
                            message: '{0} discards {1}',
                            messageArgs: card => [context.targets.character.controller, card],
                            gameAction: AbilityDsl.actions.discardFromPlay()
                        })),
                        'Bow this character': AbilityDsl.actions.bow(context => ({ target: context.targets.character }))
                    }
                }
            },
            cannotTargetFirst: true
        });
    }
}

AkodoCho.id = 'akodo-cho';

module.exports = AkodoCho;
