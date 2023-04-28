import { CardTypes } from '../../Constants';
import { EventRegistrar } from '../../EventRegistrar';
import AbilityDsl = require('../../abilitydsl');
import DrawCard = require('../../drawcard');
import BaseCard = require('../../basecard');

export default class KakitasFinalStance extends DrawCard {
    static id = 'kakita-s-final-stance';

    private duelParticipantsThisConflict = new Set<BaseCard>();

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
                        condition: () => this.duelParticipantsThisConflict.has(context.target),
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
        this.duelParticipantsThisConflict.clear();
    }

    public afterDuel(event: any) {
        if (event.duel.challenger) {
            this.duelParticipantsThisConflict.add(event.duel.challenger);
        }
        if (event.duel.target) {
            this.duelParticipantsThisConflict.add(event.duel.target);
        }
    }
}
