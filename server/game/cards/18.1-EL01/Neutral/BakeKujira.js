const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar');
const { Locations } = require('../../../Constants');

class BakeKujira extends DrawCard {
    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onCardLeavesPlay']);

        this.legendary(1);
        // Provided for reference
        // legendary(fate): void {
        //     this.persistentEffect({
        //         location: Locations.Any,
        //         targetLocation: Locations.Any,
        //         effect: [
        //             AbilityDsl.effects.playerCannot({
        //                 cannot: 'placeFateWhenPlayingCharacterFromProvince',
        //                 restricts: 'source'
        //             }),
        //             AbilityDsl.effects.cardCannot({
        //                 cannot: 'putIntoPlay',
        //                 restricts: 'cardEffects'
        //             }),
        //             AbilityDsl.effects.cardCannot({
        //                 cannot: 'placeFate'
        //             }),
        //             AbilityDsl.effects.cardCannot({
        //                 cannot: 'preventedFromLeavingPlay'
        //             }),
        //             AbilityDsl.effects.cardCannot({
        //                 cannot: 'enterPlay',
        //                 restricts: 'nonDynastyPhase'
        //             }),
        //             AbilityDsl.effects.legendaryFate(fate)
        //         ]
        //     });
        // }

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => 2 * this.getSkillBonus(card))
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.immunity({
                restricts: 'nonMonstrousEvents'
            })
        });

        this.action({
            title: 'Discard a character',
            effect: 'swallow {0} whole!',
            condition: context => context.source.isParticipating(),
            target: {
                activePromptTitle: 'Choose a character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.discardFromPlay(context => ({ target: context.target.attachments.toArray() })),
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
