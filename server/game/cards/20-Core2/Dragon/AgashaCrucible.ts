import { CardTypes, Durations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';
import { PlayAttachmentAction } from '../../../PlayAttachmentAction';

export default class AgashaCrucible extends DrawCard {
    static id = 'agasha-crucible';

    public setupCardAbilities() {
        this.interrupt({
            title: 'Satisfy Affinity for the next Spell',
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
            gameAction: AbilityDsl.actions.playerLastingEffect({
                targetController: Players.Self,
                duration: Durations.UntilSelfPassPriority,
                effect: AbilityDsl.effects.satisfyAffinity(['air', 'earth', 'fire', 'water', 'void'])
            }),
            effect: 'satisfy all elemental affinities'
        });
    }

    #isSpell(card: DrawCard) {
        return card.hasTrait('spell');
    }
}
