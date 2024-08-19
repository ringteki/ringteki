import AbilityDsl from '../../../abilitydsl';
import { CardTypes, TargetModes } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class ElementalPunch extends DrawCard {
    static id = 'elemental-punch';

    setupCardAbilities() {
        this.action({
            title: "Increase a monk's military skill and claim a ring",
            effect: 'grant 2 military skill to {0} and claim a ring',
            condition: () => this.game.isDuringConflict('military'),
            targets: {
                ring: {
                    mode: TargetModes.Ring,
                    activePromptTitle: 'Choose an unclaimed ring',
                    ringCondition: (ring) => ring.isUnclaimed(),
                    gameAction: AbilityDsl.actions.claimRing({ takeFate: true })
                },
                monk: {
                    cardType: CardTypes.Character,
                    cardCondition: (card) => card.isParticipating() && card.hasTrait('monk'),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(2)
                    })
                }
            }
        });
    }
}