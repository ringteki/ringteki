import AbilityDsl from '../../../abilitydsl';
import { CardTypes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class KeeperOfInnerPeace extends DrawCard {
    static id = 'keeper-of-inner-peace';

    setupCardAbilities() {
        this.reaction({
            title: 'Add fate to a character',
            when: {
                onMoveFate: (event, context) =>
                    !context.source.bowed &&
                    event.context.source.name !== 'Framework effect' &&
                    event.fate > 0 &&
                    event.origin?.type === CardTypes.Character &&
                    event.origin?.controller === context.player
            },
            gameAction: AbilityDsl.actions.placeFate((context: any) => ({ target: context.event.origin }))
        });
    }
}
