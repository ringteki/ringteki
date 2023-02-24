const DrawCard = require('../../../drawcard.js');
const { Decks, CardTypes, Durations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class KitsukiMasanori extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Search your conflict deck',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            effect: 'search their deck for a technique or title',
            gameAction: AbilityDsl.actions.deckSearch({
                activePromptTitle: 'Select an attachment',
                deck: Decks.ConflictDeck,
                reveal: true,
                cardCondition: (card, context) => card.type === CardTypes.Attachment && (card.hasTrait('title') || card.hasTrait('technique')) && card.canAttach(context.source),
                selectedCardsHandler: (context, event, cards) => {
                    if(cards && cards.length > 0) {
                        const card = cards[0];
                        this.game.addMessage('{0} takes {1} and attaches it to {2}', event.player, card, context.source);
                        const attachAction = AbilityDsl.actions.attach({
                            target: context.source,
                            attachment: card
                        });
                        const cannotTargetAction = AbilityDsl.actions.cardLastingEffect(context => ({
                            condition: (context) => card.parent === context.source,
                            duration: Durations.Custom,
                            target: card,
                            effect: AbilityDsl.effects.cardCannot({
                                cannot: 'target',
                                restricts: 'opponentsCardAbilities',
                                applyingPlayer: context.player
                            })
                        }));

                        context.game.queueSimpleStep(() => {
                            attachAction.resolve(null, context);
                        });
                        context.game.queueSimpleStep(() => {
                            cannotTargetAction.resolve(null, context);
                        });
                    }
                }
                // gameAction: AbilityDsl.actions.sequentialContext(context => {
                //     const events = context.events.filter(a => a.name === 'onDeckSearch' && !a.cancelled);
                //     if(events.length > 0 && events[0].selectedCards) {
                //         const selectedCard = events[0].selectedCards;

                //         return {
                //             gameActions: [
                //                 AbilityDsl.actions.attach(context => ({
                //                     target: context.source
                //                 })),
                //                 AbilityDsl.actions.cardLastingEffect({
                //                     condition: () => this.game.isDuringConflict('political'),
                //                     effect: AbilityDsl.effects.doesNotBow()
                //                 }),
                //             ]
                //         }
                //     }
                // }),
            })
            // then: {
            //     gameAction: AbilityDsl.actions.cardLastingEffect(context => ({

            //     }))
            // }
        });
    }
}

KitsukiMasanori.id = 'kitsuki-masanori';

module.exports = KitsukiMasanori;
