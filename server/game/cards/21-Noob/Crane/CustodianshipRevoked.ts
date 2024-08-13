import { CardTypes, Players, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CustodianshipRevoked extends DrawCard {
    static id = 'custodianship-revoked';

    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            match: (player) => player.imperialFavor !== '',
            effect: AbilityDsl.effects.reduceCost({ match: (card, source) => card === source })
        });

        this.action({
            title: 'Discard an attachment',
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: (card, context) =>
                    context.player.opponent && card.parent?.controller === context.player.opponent,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }
}
