import { CardTypes, Durations, Locations, Players, TokenTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class HidaHonoka extends DrawCard {
    static id = 'hida-honoka';

    setupCardAbilities() {
        this.action({
            title: 'Restore a province',
            target: {
                location: Locations.Provinces,
                cardType: CardTypes.Province,
                cardCondition: (card) => card.isBroken,
                gameAction: AbilityDsl.actions.restoreProvince()
            },
            then: {
                gameAction: AbilityDsl.actions.playerLastingEffect({
                    targetController: Players.Self,
                    duration: Durations.Persistent,
                    effect: AbilityDsl.effects.playerCannot({
                        cannot: 'restoreProvince'
                    })
                })
            }
        });
    }
}
