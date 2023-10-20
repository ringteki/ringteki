import { CardTypes, Locations } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import AkodoRecruit from '../../AkodoRecruit';

export default class SoldierTrainingGrounds extends DrawCard {
    static id = 'soldier-training-grounds';

    setupCardAbilities() {
        this.action({
            title: 'Recruit a fresh Ashigaru',
            effect: 'recruit {1}!',
            effectArgs: {
                id: 'akodo-recruit',
                label: 'Akodo Recruit',
                name: 'Akodo Recruit',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.handler({
                handler: (context) => {
                    const card = context.player.dynastyDeck.first();
                    const token = context.game.createToken(card, AkodoRecruit);
                    card.owner.removeCardFromPile(card);
                    card.moveTo(Locations.RemovedFromGame);
                    const moveEvents = [];
                    context.game.actions.putIntoPlay({ target: token }).addEventsToArray(moveEvents, context);
                    context.game.openThenEventWindow(moveEvents);
                    return true;
                }
            })
        });
    }
}
