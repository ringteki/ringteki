import { CardTypes, Players, TargetModes } from '../../../Constants';
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
                controller: Players.Opponent,
                cardCondition: (card: BaseCard) =>
                    card.attachments.length === 0 && (card.isParticipating() || card.parent?.isParticipating()),
                gameAction: AbilityDsl.actions.bow()
            },
            then: (context) => ({
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'fire',
                    gameAction: AbilityDsl.actions.conditional({
                        condition: () => (context.target as DrawCard).type === CardTypes.Attachment,
                        trueGameAction: AbilityDsl.actions.discardFromPlay({ target: context.target }),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                })
            })
        });
    }
}
