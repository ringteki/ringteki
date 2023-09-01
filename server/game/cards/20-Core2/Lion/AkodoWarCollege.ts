import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AkodoWarCollege extends DrawCard {
    static id = 'akodo-war-college';

    setupCardAbilities() {
        this.action({
            title: 'Recruit a fresh Bushi',
            effect: 'recruits {1}!',
            effectArgs: {
                id: 'akodo-recruit',
                label: 'Akodo Recruit',
                name: 'Akodo Recruit',
                facedown: false,
                type: CardTypes.Character
            },
            gameAction: AbilityDsl.actions.createToken((context) => ({ target: context.player.dynastyDeck.first() }))
        });
    }
}
