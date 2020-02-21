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
                    activePromptTitle: 'Choose a token',
                    mode: TargetModes.Token
                },
                character: {
                    activePromptTitle: 'Choose a character',
                    dependsOn: 'token',
                    cardType: CardTypes.Character,
                    cardCondition: (card, context) => card.controller !== context.tokens.token.card.controller && card.isParticipating(),
                    player: Players.Any,
                    gameAction: AbilityDsl.actions.conditional({
                        condition: context => context.tokens.token.honored,
                        trueGameAction: AbilityDsl.actions.honor(),
                        falseGameAction: AbilityDsl.actions.dishonor()
                    })
                }
            }
        });
    }
}

AGameOfLetters.id = 'a-game-of-letters';

module.exports = AGameOfLetters;
