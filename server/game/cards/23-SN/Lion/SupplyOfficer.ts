import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class SupplyOfficer extends DrawCard {
    static id = 'supply-officer';

    setupCardAbilities() {
        this.conflictAction({
            evenFromHome: true,
            title: 'Switch 2 characters you control',
            targets: {
                characterInConflict: {
                    activePromptTitle: 'Choose a participating character to send home',
                    cardType: CardType.Character,
                    controller: Players.Self,
                    cardCondition: card => card.isParticipating()
                },
                characterAtHome: {
                    dependsOn: 'characterInConflict',
                    activePromptTitle: 'Choose a character to move to the conflict',
                    cardType: CardType.Character,
                    controller: Players.Self,
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.joint([
                            AbilityDsl.actions.sendHome(context => ({ target: context.targets.characterInConflict })),
                            AbilityDsl.actions.moveToConflict()
                        ]),
                        AbilityDsl.actions.ready(context => ({
                            target: context.targets.characterInConflict
                        }))
                    ])
                }
            },
            effect: 'switch {1} and {2}, readying {1}',
            effectArgs: context => [context.targets.characterInConflict, context.targets.characterAtHome]
        });
    }
}
