import { CardTypes, Durations } from '../../Constants';
import type { Duel } from '../../Duel';
import { EventRegistrar } from '../../EventRegistrar';
import AbilityDsl from '../../abilitydsl';
import DrawCard from '../../drawcard';

export default class RisingStarsKata extends DrawCard {
    static id = 'rising-stars-kata';

    private duelWinnersThisConflict = new Set<DrawCard>();
    private eventRegistrar: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);

        this.action({
            title: 'Give a participating unique character +3 military skill',
            condition: (context) => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfConflict,
                    effect: this.duelWinnersThisConflict.has(context.target)
                        ? AbilityDsl.effects.modifyMilitarySkill(5)
                        : AbilityDsl.effects.modifyMilitarySkill(3)
                }))
            },
            effect: 'give {0} +{1} {2} skill until the end of the conflict',
            effectArgs: (context) => [this.duelWinnersThisConflict.has(context.target) ? 5 : 3, 'military'],
            max: AbilityDsl.limit.perConflict(1)
        });
    }

    public onConflictFinished() {
        this.duelWinnersThisConflict.clear();
    }

    public afterDuel({ duel }: { duel: Duel }) {
        for (const duelWinner of duel.winner ?? []) {
            this.duelWinnersThisConflict.add(duelWinner);
        }
    }
}