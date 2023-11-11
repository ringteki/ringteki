import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import type DrawCard from '../../../drawcard';
import { BattlefieldAttachment } from '../../BattlefieldAttachment';

export default class DaclarationOfDominion extends BattlefieldAttachment {
    static id = 'declaration-of-dominion';

    public setupCardAbilities() {
        super.setupCardAbilities();

        this.action({
            title: 'Gives Pride to an attacker and a defender',
            condition: (context) => context.source.parent?.isConflictProvince(),
            targets: {
                ownSide: {
                    cardType: CardTypes.Character,
                    controller: Players.Self,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.addKeyword('pride')
                    })
                },
                otherSide: {
                    cardType: CardTypes.Character,
                    controller: Players.Opponent,
                    cardCondition: (card: DrawCard) => card.isParticipating(),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.addKeyword('pride')
                    })
                }
            }
        });
    }
}
