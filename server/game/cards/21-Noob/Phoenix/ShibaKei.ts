import { CardTypes, Locations } from '../../../Constants';
import DrawCard from '../../../drawcard';
import type { AbilityContext } from '../../../AbilityContext';
import AbilityDsl from '../../../abilitydsl';
import { ShibaGuardian } from '../../ShibaGuardian';

function putShibaGuardianTokenIntoPlay(context: AbilityContext) {
    const card = context.player.dynastyDeck.first();
    const token = context.game.createToken(card, ShibaGuardian);
    card.owner.removeCardFromPile(card);
    card.moveTo(Locations.RemovedFromGame);
    const moveEvents = [];
    context.game.actions.putIntoPlay({ target: token }).addEventsToArray(moveEvents, context);
    context.game.openThenEventWindow(moveEvents);
    return true;
}

export default class ShibaKei extends DrawCard {
    static id = 'shiba-kei';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.reduceCost({
                match: (card) => card.hasTrait('gaijin'),
                targetCondition: (target, source) => target === source
            })
        });

        this.action({
            title: 'Recruit a fresh Yojimbo',
            effect: 'recruit {1}!',
            effectArgs: {
                id: 'shiba-guardian',
                label: 'Shiba Guardian',
                name: 'Shiba Guardian',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.handler({ handler: putShibaGuardianTokenIntoPlay })
        });
    }
}
