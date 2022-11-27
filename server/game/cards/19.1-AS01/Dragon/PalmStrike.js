const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { Players, Durations, CardTypes } = require('../../../Constants');

class PalmStrike extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            targets: {
                myMonk: {
                    activePromptTitle: 'Choose a bare-handed monk',
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (monkCharacter) =>
                        monkCharacter.isParticipating() &&
                        monkCharacter.hasTrait('monk') &&
                        this.cardHasNoWeaponAttachments(monkCharacter)
                },
                characterToBow: {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (opponentCharacter) =>
                        opponentCharacter.isParticipating() &&
                        this.cardHasNoWeaponAttachments(opponentCharacter),
                    gameAction: AbilityDsl.actions.multipleContext(
                        (context) => ({
                            gameActions: [
                                AbilityDsl.actions.bow(),
                                AbilityDsl.actions.cardLastingEffect(() => ({
                                    effect: AbilityDsl.effects.cardCannot({
                                        cannot: 'ready'
                                    }),
                                    duration: context.targets.myMonk.hasTrait(
                                        'tattooed'
                                    )
                                        ? Durations.UntilEndOfPhase
                                        : Durations.UntilEndOfConflict
                                }))
                            ]
                        })
                    )
                }
            },
            effect: 'bow {1} — they are {2}{3}{4}.',
            effectArgs: (context) => [
                context.targets.characterToBow,
                context.targets.myMonk.hasTrait('tattooed')
                    ? 'overwhelmed by the mystical tattoos of'
                    : 'stricken down by',
                context.targets.myMonk.isUnique() ? ' ' : ' the ',
                context.targets.myMonk
            ]
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
