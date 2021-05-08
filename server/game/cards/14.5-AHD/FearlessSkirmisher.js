const DrawCard = require('../../drawcard.js');
import { CardTypes, TargetModes, Players, Locations, CharacterStatus } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl');

class FearlessSkirmisher extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Move a dishonored status token',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && context.source.isParticipating() && event.conflict.conflictType === 'military'
            },
            targets: {
                token: {
                    activePromptTitle: 'Choose a dishonored token',
                    mode: TargetModes.Token,
                    location: Locations.Any,
                    cardCondition: card => {
                        return card.grantedStatus === CharacterStatus.Dishonored;
                    }
                },
                character: {
                    activePromptTitle: 'Choose a character to receive the token',
                    dependsOn: 'token',
                    cardType: CardTypes.Character,
                    player: Players.Any,
                    gameAction: AbilityDsl.actions.moveStatusToken(context => ({
                        target: context.tokens.token,
                        recipient: context.targets.character
                    }))
                }
            }
        });
    }
}

FearlessSkirmisher.id = 'fearless-skirmisher';

module.exports = FearlessSkirmisher;

