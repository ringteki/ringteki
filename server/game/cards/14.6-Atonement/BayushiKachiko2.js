const DrawCard = require('../../drawcard.js');
const { Locations, Players, EventNames, CardTypes, PlayTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class BayushiKachiko2 extends DrawCard {
    setupCardAbilities() {
        const MAXIMUM_CARDS_ALLOWED = 3;
        this.mostRecentEvent = null;
        this.cardsPlayedThisRound = 0;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnRoundEnded, EventNames.OnCharacterEntersPlay]);

        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                when: {
                    onCardPlayed: (event, context) => {
                        if(this.cardsPlayedThisRound >= MAXIMUM_CARDS_ALLOWED) {
                            return false;
                        }
                        this.mostRecentEvent = event;
                        return (event.originalLocation === Locations.ConflictDiscardPile && event.card.owner === context.player.opponent &&
                        event.card.type === CardTypes.Event && !event.onPlayCardSource && !event.card.fromOutOfPlaySource &&
                        event.player === context.source.controller && !event.sourceOfCardPlayedFromConflictDiscard &&
                        context.game.isDuringConflict('political') && context.source.isParticipating());
                    }
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        if(this.mostRecentEvent.sourceOfCardPlayedFromConflictDiscard && this.mostRecentEvent.sourceOfCardPlayedFromConflictDiscard !== this) {
                            return;
                        }
                        if(!this.cardsPlayedThisRound || this.cardsPlayedThisRound < 0) {
                            this.cardsPlayedThisRound = 0;
                        }
                        this.mostRecentEvent.sourceOfCardPlayedFromConflictDiscard = this;
                        this.cardsPlayedThisRound++;
                        this.game.addMessage('{0} plays a card from their opponent\'s conflict discard pile due to the ability of {1} ({2} use{3} remaining)', context.source.controller, context.source, MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound, MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound === 1 ? '' : 's');
                        this.game.addMessage('{0} is removed from the game due to the ability of {1}', this.mostRecentEvent.card, context.source);
                        this.mostRecentEvent.card.owner.moveCard(this.mostRecentEvent.card, Locations.RemovedFromGame);
                    }
                })
            })
        });

        this.persistentEffect({
            condition: context => {
                return context.game.isDuringConflict('political') && context.source.isParticipating() && this.cardsPlayedThisRound < MAXIMUM_CARDS_ALLOWED;
            },
            location: Locations.PlayArea,
            targetLocation: Locations.ConflictDiscardPile,
            targetController: Players.Opponent,
            match: (card, context) => {
                return card.type === CardTypes.Event && card.location === Locations.ConflictDiscardPile && card.owner === context.player.opponent;
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay((player, card) => {
                    return player !== card.owner;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });
    }

    onRoundEnded() {
        this.cardsPlayedThisRound = 0;
    }

    onCharacterEntersPlay(event) {
        if(event.card === this) {
            this.cardsPlayedThisRound = 0;
        }
    }
}

BayushiKachiko2.id = 'bayushi-kachiko-2';

module.exports = BayushiKachiko2;
