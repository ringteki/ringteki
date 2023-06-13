import { Elements, Locations, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class AngrySohei extends DrawCard {
    static id = 'angry-sohei';

    readonly #air = `${AngrySohei.id}-air`;
    readonly #fire = `${AngrySohei.id}-fire`;
    readonly #void = `${AngrySohei.id}-void`;

    public setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Replace a ring effect with another ring effect',
            when: {
                onResolveRingElement: (event, context) =>
                    context.source.isAttacking() && event.player === context.player
            },
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            gameAction: AbilityDsl.actions.cancel({
                replacementGameAction: AbilityDsl.actions.selectRing({
                    activePromptTitle: 'Choose a ring effect to resolve',
                    player: Players.Self,
                    targets: true,
                    ringCondition: (ring) => this.#ringOptions().includes(ring.element),
                    message: "{0} chooses to resolve {1}'s effect",
                    messageArgs: (ring, player) => [player, ring],
                    gameAction: AbilityDsl.actions.resolveRingEffect((context) => ({ player: context.player }))
                })
            }),
            effect: 'change which ring effect they will resolve'
        });
    }

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({ key: this.#air, prettyName: 'Air ring', element: Elements.Air });
        symbols.push({ key: this.#fire, prettyName: 'Fire ring', element: Elements.Fire });
        symbols.push({ key: this.#void, prettyName: 'Void ring', element: Elements.Void });
        return symbols;
    }

    #ringOptions(): Elements[] {
        return [
            this.getCurrentElementSymbol(this.#air),
            this.getCurrentElementSymbol(this.#fire),
            this.getCurrentElementSymbol(this.#void)
        ];
    }
}
