const DrawCard = require('../../drawcard.js');
const { Locations, Players, EventNames } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class MasterTactician extends DrawCard {
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
                        return (event.originalLocation === Locations.ConflictDeck &&
                        event.originallyOnTopOfConflictDeck && event.player === context.source.controller && !event.sourceOfCardPlayedFromConflictDeck &&
                        context.source.isParticipating()) && context.game.isTraitInPlay('battlefield');
                    }
                },
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        if(this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck && this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck !== this) {
                            return;
                        }
                        if(!this.cardsPlayedThisRound || this.cardsPlayedThisRound < 0) {
                            this.cardsPlayedThisRound = 0;
                        }
                        this.mostRecentEvent.sourceOfCardPlayedFromConflictDeck = this;
                        this.cardsPlayedThisRound++;
                        this.game.addMessage('{0} plays a card from their conflict deck due to the ability of {1} ({2} use{3} remaining)', context.source.controller, context.source, MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound, MAXIMUM_CARDS_ALLOWED - this.cardsPlayedThisRound === 1 ? '' : 's');
                    }
                })
            })
        });

        this.persistentEffect({
            condition: context => context.game.isTraitInPlay('battlefield') && context.source.isParticipating() && this.cardsPlayedThisRound < MAXIMUM_CARDS_ALLOWED,
            targetLocation: Locations.ConflictDeck,
            match: (card, context) => {
                return context && card === context.player.conflictDeck.first();
            },
            effect: AbilityDsl.effects.canPlayFromOutOfPlay()
        });

        this.persistentEffect({
            condition: context => {
                let defending = context.game.currentConflict && context.source.controller.isDefendingPlayer();
                let preventShowing = defending && !context.game.currentConflict.defendersChosen;
                return context.game.isTraitInPlay('battlefield') && context.source.isParticipating() && !preventShowing;
            },
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopConflictCard(Players.Self)
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

MasterTactician.id = 'master-tactician';

module.exports = MasterTactician;
