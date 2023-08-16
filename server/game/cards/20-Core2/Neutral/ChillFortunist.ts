import { Elements, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ChillFortunist extends DrawCard {
    static id = 'chill-fortunist';

    readonly #earth = `${ChillFortunist.id}-earth`;
    readonly #water = `${ChillFortunist.id}-water`;
    readonly #void = `${ChillFortunist.id}-void`;

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Replace a ring effect with another ring effect',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isDefending();
                }
            },
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            gameAction: AbilityDsl.actions.selectRing({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                targets: true,
                ringCondition: (ring) => this.#ringOptions().includes(ring.element),
                message: "{0} chooses to resolve {1}'s effect",
                messageArgs: (ring, player) => [player, ring],
                gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ player: context.player }))
            }),
            effect: 'change which ring effect they will resolve'
        });
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({ key: this.#earth, prettyName: 'Earth ring', element: Elements.Earth });
        symbols.push({ key: this.#water, prettyName: 'Water ring', element: Elements.Water });
        symbols.push({ key: this.#void, prettyName: 'Void ring', element: Elements.Void });
        return symbols;
    }

    #ringOptions(): Elements[] {
        const elements = new Set<Elements>();

        const earth = this.getCurrentElementSymbol(this.#earth);
        if (earth !== 'none') {
            elements.add(earth);
        }
        const water = this.getCurrentElementSymbol(this.#water);
        if (water !== 'none') {
            elements.add(water);
        }
        const voidEl = this.getCurrentElementSymbol(this.#void);
        if (voidEl !== 'none') {
            elements.add(voidEl);
        }

        return Array.from(elements.values());
    }
}
