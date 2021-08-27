const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar');
const { Locations, Players } = require('../../../Constants');

class Stowaway extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.action({
            title: 'Place a card underneath self',
            limit: AbilityDsl.limit.perConflict(1),
            effect: 'place {0} beneath {1}',
            condition: context => context.source.isParticipating(),
            effectArgs: context => [context.source],
            target: {
                activePromptTitle: 'Choose a card',
                location: [Locations.DynastyDiscardPile, Locations.ConflictDiscardPile],
                player: Players.Any,
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.target;
                        context.player.moveCard(card, this.uuid);
                        card.controller = context.source.controller;
                        card.facedown = false;
                        card.lastingEffect(() => ({
                            until: {
                                onCardMoved: event => event.card === card && event.originalLocation === this.uuid
                            },
                            match: card,
                            effect: [
                                AbilityDsl.effects.hideWhenFaceUp()
                            ]
                        }));
                    }
                })
            }
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card) {
        return card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length;
    }

    onCardLeavesPlay(event) {
        if(event.card === this) {
            const cards = this.controller.getSourceList(this.uuid).map(a => a);
            cards.forEach(card => {
                this.controller.moveCard(card, Locations.RemovedFromGame);
            });
            if(cards.length > 0) {
                this.game.addMessage('{0} {1} removed from the game due to {2} leaving play', cards, cards.length === 1 ? 'is' : 'are', this);
            }
        }
    }
}

Stowaway.id = 'stowaway';

module.exports = Stowaway;
