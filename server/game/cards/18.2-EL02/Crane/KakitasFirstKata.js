const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const EventRegistrar = require('../../../eventregistrar.js');
import { CardTypes, EventNames, Players } from '../../../Constants.js';

class KakitasFirstKata extends DrawCard {
    setupCardAbilities() {
        this.bowedCharactersThisConflict = [];
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnConflictFinished, EventNames.OnCardBowed]);

        this.action({
            title: 'Prevent opponent\'s bow and move effects',
            condition: context => context.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('duelist') || card.isFaction('crane'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'moveToConflict',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.cardLastingEffect(context => ({
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    })),
                    AbilityDsl.actions.conditional({
                        condition: (context) => this.bowedCharactersThisConflict.includes(context.target),
                        trueGameAction: AbilityDsl.actions.ready(context => ({ target: context.target })),
                        falseGameAction: AbilityDsl.actions.draw({ amount: 0 })
                    })
                ])
            },
            effect: '{1}prevent opponents\' actions from bowing or moving {0}',
            effectArgs: (context) => this.bowedCharactersThisConflict.includes(context.target) ? 'ready and ' : ''
        });
    }

    onConflictFinished() {
        this.bowedCharactersThisConflict = [];
    }

    onCardBowed(event) {
        if(event.card.type === CardTypes.Character) {
            this.bowedCharactersThisConflict = this.bowedCharactersThisConflict.concat(event.card);
        }
    }
}

KakitasFirstKata.id = 'kakita-s-first-kata';

module.exports = KakitasFirstKata;
