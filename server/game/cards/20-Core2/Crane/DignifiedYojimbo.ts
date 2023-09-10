import { CardTypes, Durations, CharacterStatus, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class DignifiedYojimbo extends DrawCard {
    static id = 'dignified-yojimbo';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from losing an honor token',
            when: {
                onStatusTokenMoved: (event, context) => event.token.grantedStatus === CharacterStatus.Honored &&
                    event.token.card.controller === context.player &&
                    event.token.card.type === CardTypes.Character,
                onCardDishonored: (event, context) => event.card.isHonored &&
                    event.card.controller === context.player &&
                    event.card.type === CardTypes.Character
            },
            effect: 'prevent {1} from losing their status token',
            effectArgs: context => context.event.token?.card ?? context.event.card,
            gameAction: AbilityDsl.actions.cancel(context => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.bow()
            }))
        });
    }
}
