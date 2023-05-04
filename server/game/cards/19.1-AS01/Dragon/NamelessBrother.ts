import AbilityContext = require('../../../AbilityContext');
import { CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class NamelessBrother extends DrawCard {
    static id = 'nameless-brother';

    public setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) => card.controller === context.player && card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyBothSkills((character: BaseCard, context: AbilityContext) =>
                (context.player.cardsInPlay as BaseCard[]).reduce(
                    (skillBonus, otherCard) =>
                        otherCard.type === CardTypes.Character &&
                        otherCard.name === character.name &&
                        otherCard.uuid !== character.uuid
                            ? skillBonus + 1
                            : skillBonus,
                    0
                )
            )
        });
    }
}
