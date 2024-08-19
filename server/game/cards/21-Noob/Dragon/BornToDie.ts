import AbilityDsl from '../../../abilitydsl';
import { CardTypes, EventNames } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class BornToDie extends DrawCard {
    static id = 'born-to-die';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard a fate from a character',
            when: {
                [EventNames.OnMoveFate]: ({ recipient, fate }) =>
                    recipient instanceof DrawCard && recipient.type === CardTypes.Character && fate > 0
            },
            gameAction: AbilityDsl.actions.removeFate((context: any) => ({
                target: context.event.recipient,
                amount: 1
            }))
            //effect: 'discard a fate from {1}{2}',
            //effectArgs: (context) => [context.targets.myCharacter, this.buildString(context)]
        });
    }
}
