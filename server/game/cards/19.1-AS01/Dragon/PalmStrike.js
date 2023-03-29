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
                    dependsOn: 'myMonk',
                    activePromptTitle: 'Choose a character to bow',
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (opponentCharacter) =>
                        opponentCharacter.isParticipating() &&
                        this.cardHasNoWeaponAttachments(opponentCharacter),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.bow(),
                        AbilityDsl.actions.conditional({
                            condition: (context) => context.targets.myMonk && context.targets.myMonk.hasTrait('tattooed'),
                            falseGameAction: AbilityDsl.actions.noAction(),
                            trueGameAction:
                                AbilityDsl.actions.cardLastingEffect({
                                    effect: AbilityDsl.effects.cardCannot({
                                        cannot: 'ready'
                                    }),
                                    duration: Durations.UntilEndOfConflict
                                })
                        })
                    ])
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
