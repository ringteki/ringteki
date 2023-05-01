import { CardTypes } from '../../Constants';
import { EventRegistrar } from '../../EventRegistrar';
import AbilityDsl = require('../../abilitydsl');
import DrawCard = require('../../drawcard');

export default class KakitasFinalStance extends DrawCard {
    static id = 'kakita-s-final-stance';

    private duelParticipantsInThisConflict = new Set<DrawCard>();

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'afterDuel']);
        this.action({
            title: "Character cannot be bowed and doesn't bow during resolution",
            condition: () => this.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating(),
                gameAction: [
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        condition: () => this.duelParticipantsInThisConflict.has(context.target),
                        effect: AbilityDsl.effects.doesNotBow()
                    })),
                    AbilityDsl.actions.cardLastingEffect((context) => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    }))
                ]
            },
            effect: "prevent opponents' actions from bowing {0} and stop it bowing at the end of the conflict if it is involved in a duel"
        });
    }

    public onConflictFinished() {
        this.duelParticipantsInThisConflict.clear();
    }

    public afterDuel(event: any) {
        if (event.duel.challenger instanceof DrawCard) {
            this.duelParticipantsInThisConflict.add(event.duel.challenger);
        }
        if (event.duel.target instanceof DrawCard) {
            this.duelParticipantsInThisConflict.add(event.duel.target);
        }
        if (Array.isArray(event.duel.target)) {
            for (const target of event.duel.target) {
                if (target instanceof DrawCard) {
                    this.duelParticipantsInThisConflict.add(target);
                }
            }
        }
    }
}
