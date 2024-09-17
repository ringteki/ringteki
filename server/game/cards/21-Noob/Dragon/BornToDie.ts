import AbilityDsl from '../../../abilitydsl';
import { CardTypes, EventNames } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class BornToDie extends DrawCard {
    static id = 'born-to-die';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard a fate from a character',
            cannotBeMirrored: true,
            when: {
                [EventNames.OnCharacterEntersPlay]: (event) =>
                    event.card instanceof DrawCard && event.card.type === CardTypes.Character && event.card.fate === 1,
                [EventNames.OnMoveFate]: ({ recipient, fate }) =>
                    recipient instanceof DrawCard && recipient.type === CardTypes.Character && fate === 1
            },
            gameAction: AbilityDsl.actions.removeFate((context: any) => ({
                target: context.event.recipient || context.event.card,
                amount: 1
            })),
            max: AbilityDsl.limit.perPhase(1)

            //effect: 'discard a fate from {1}{2}',
            //effectArgs: (context) => [context.targets.myCharacter, this.buildString(context)]
        });
    }
}
