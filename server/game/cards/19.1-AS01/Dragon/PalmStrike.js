const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, Durations, CardTypes } = require('../../../Constants');

class PalmStrike extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            target: {
                activePromptTitle: 'Choose a bare-handed monk',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (monkCharacter) =>
                    monkCharacter.isParticipating() &&
                    monkCharacter.hasTrait('monk') &&
                    this.cardHasNoWeaponAttachments(monkCharacter),
                gameAction: AbilityDsl.actions.selectCard((context) => ({
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    activePromptTitle: 'Choose a character to bow',
                    cardCondition: (opponentCharacter) =>
                        opponentCharacter.isParticipating() &&
                        this.cardHasNoWeaponAttachments(opponentCharacter),
                    message: '{0} {1} {2}{3}',
                    messageArgs: (card) => [
                        context.target,
                        context.target.hasTrait('tattooed')
                            ? 'overpowers'
                            : 'strikes down',
                        card,
                        context.target.hasTrait('tattooed')
                            ? ' with the mystical powers of the Ise Zumi.'
                            : '.'
                    ],
                    gameAction: AbilityDsl.actions.multipleContext(() => ({
                        gameActions: [
                            AbilityDsl.actions.bow(),
                            AbilityDsl.actions.cardLastingEffect(() => {
                                return {
                                    effect: AbilityDsl.effects.cardCannot({
                                        cannot: 'ready'
                                    }),
                                    duration: context.target.hasTrait(
                                        'tattooed'
                                    )
                                        ? Durations.UntilEndOfPhase
                                        : Durations.UntilEndOfConflict
                                };
                            })
                        ]
                    }))
                }))
            },
            effect: 'bow an opposing character'
        });
    }

    cardHasNoWeaponAttachments(card) {
        return !card.attachments.any((attachment) =>
            attachment.hasTrait('weapon')
        );
    }
}

PalmStrike.id = 'palm-strike';

module.exports = PalmStrike;
