import AbilityContext = require('../../../AbilityContext');
import { CardTypes, AbilityTypes, Players, TargetModes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class WritOfSanctification extends DrawCard {
    static id = 'writ-of-sanctification';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: 'shugenja'
        });

        this.persistentEffect({
            condition: (context) =>
                !(context.player.cardsInPlay as BaseCard[]).some(
                    (card) =>
                        (card.hasTrait('shadowlands') || card.hasTrait('haunted')) && card.type === CardTypes.Character
                ),
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Bow shadowlands or haunted',
                condition: (context: AbilityContext) => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    mode: TargetModes.Single,
                    cardCondition: (card: BaseCard) =>
                        card.isParticipating() &&
                        (card.hasTrait('haunted') || card.hasTrait('shadowlands') || card.isTainted),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}
