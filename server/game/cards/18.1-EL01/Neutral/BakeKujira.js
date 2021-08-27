const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar');
const { Locations } = require('../../../Constants');

class BakeKujira extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => 2 * this.getSkillBonus(card))
        });

        this.persistentEffect({
            location: Locations.Any,
            targetLocation: Locations.Any,
            effect: AbilityDsl.effects.cardCannot('putIntoPlay')
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({ restricts: 'events' })
        });

        this.action({
            title: 'Discard a character',
            effect: 'swallow {0} whole!',
            condition: context => context.source.isParticipating(),
            target: {
                activePromptTitle: 'Choose a character',
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.discardFromPlay(),
                    AbilityDsl.actions.handler({
                        handler: context => {
                            const card = context.target;
                            if(card.location !== Locations.PlayArea) {
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
                        }
                    })
                ])
            }
        });
    }

    getSkillBonus(card) {
        return card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length;
    }

    onCardLeavesPlay(event) {
        if(event.card === this) {
            const cardsToMove = this.controller.getSourceList(this.uuid).map(a => a);
            if(cardsToMove.length > 0) {
                this.shuffleArray(cardsToMove);
                cardsToMove.forEach(c => {
                    const location = c.isConflict ? Locations.ConflictDeck : Locations.DynastyDeck;
                    c.owner.moveCard(c, location, { bottom: true });
                });
                this.game.addMessage('{0} {1} put on the bottom of the deck due to {2} leaving play', cardsToMove, cardsToMove.length === 1 ? 'is' : 'are', this);
            }
        }
    }
}

BakeKujira.id = 'bake-kujira';

module.exports = BakeKujira;
