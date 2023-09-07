import { CardTypes, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type BaseCard from '../../../basecard';
import DrawCard from '../../../drawcard';

export default class HeartOfTheInferno extends DrawCard {
    static id = 'heart-of-the-inferno';

    setupCardAbilities() {
        this.action({
            title: 'Bow a card',
            condition: (context) =>
                context.player.anyCardsInPlay((card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')),
            target: {
                mode: TargetModes.Single,
                cardCondition: (card: BaseCard) => card.attachments.length === 0 && card.isParticipating(),
                gameAction: [
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.conditional({
                        condition: (context) =>
                            context.player.anyCardsInPlay(
                                (card: DrawCard) =>
                                    card.isParticipating() &&
                                    card.hasTrait('shugenja') &&
                                    card.hasTrait('fire') &&
                                    (context.target as DrawCard).type === CardTypes.Attachment
                            ),
                        trueGameAction: AbilityDsl.actions.discardFromPlay(),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ]
            }
        });
    }
}
