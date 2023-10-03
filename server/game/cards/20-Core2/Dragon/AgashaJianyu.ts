import { CardTypes, Durations, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction';
import Ring from '../../../ring';
import Player from '../../../player';

type Element = 'air' | 'earth' | 'fire' | 'void' | 'water';

export default class AgashaJianyu extends DrawCard {
    static id = 'agasha-jianyu';

    public setupCardAbilities() {
        this.reaction({
            title: 'Take fate from a ring and block it from enemy attacks',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player && this.#isSpell(event.card as DrawCard),
                onAbilityResolverInitiated: (event, context) => {
                    //might be able to remove the source.type check at some point
                    const isAttachment =
                        event.context.source.type === CardTypes.Attachment ||
                        event.context.ability instanceof PlayAttachmentAction;
                    return (
                        event.context.player === context.player && isAttachment && this.#isSpell(event.context.source)
                    );
                }
            },
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring',
                ringCondition: (ring: Ring) => ring.isUnclaimed() && ring.fate > 0,
                gameAction: AbilityDsl.actions.sequentialContext(context => ({
                    gameActions: [
                        AbilityDsl.actions.takeFate({ target: context.target }),
                        AbilityDsl.actions.ringLastingEffect(({
                            duration: Durations.UntilEndOfPhase,
                            target: (context.ring.getElements() as Element[]).map((element) => this.game.rings[element]),
                            effect: AbilityDsl.effects.cannotDeclareRing((player: Player) => player === context.player.opponent)
                        }))
                    ]
                }))
            },
        });
    }

    #isSpell(card: DrawCard) {
        return card.hasTrait('spell');
    }
}
