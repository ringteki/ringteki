const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, Players, CardTypes } = require('../../Constants');

class AGameOfLetters extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor or dishonor a character',
            condition: () => this.game.isDuringConflict('political'),
            targets: {
                token: {
                    // activePromptTitle: 'Choose a token',
                    // mode: TargetModes.Token,
                    // player: Players.Any
                    activePromptTitle: 'Choose a token',
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    cardCondition: card => card.isHonored || card.isDishonored
                },
                character: {
                    activePromptTitle: 'Choose a character',
                    dependsOn: 'token',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => card.controller !== context.targets.token.controller && card.isParticipating(),
                    player: Players.Any,
                    gameAction: AbilityDsl.actions.conditional({
                        condition: (context, properties) => context.targets.token.isHonored,
                        trueGameAction: AbilityDsl.actions.honor(),
                        falseGameAction: AbilityDsl.actions.dishonor()
                    })
                },
            }
        });
    }
}

AGameOfLetters.id = 'a-game-of-letters';

module.exports = AGameOfLetters;
