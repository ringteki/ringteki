const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Decks, Durations } = require('../../../Constants');
const DrawCard = require('../../../drawcard.js');

const choice = {
    discardPile: 'Search discard pile',
    conflictDeck: 'Search conflict deck'
};

const selectAttachmentPrompt = 'Select an attachment';

const attachMsg = '{0} takes {1} and attaches it to {2}';

function matchesSearchableCard(card, context) {
    return (
        card.type === CardTypes.Attachment &&
        (card.hasTrait('title') || card.hasTrait('technique')) &&
        card.canAttach(context.source)
    );
}

class KitsukiMasanori extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
        });

        this.reaction({
            title: 'Search for a Title or Technique',
            when: { onCharacterEntersPlay: (event, context) => event.card === context.source },
            effect: 'search for a Technique or Title',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.chooseAction({
                    activePromptTitle: 'Select where to search',
                    choices: {
                        [choice.discardPile]: AbilityDsl.actions.cardMenu((context) => ({
                            activePromptTitle: selectAttachmentPrompt,
                            cards: context.player.conflictDiscardPile.filter((card) =>
                                matchesSearchableCard(card, context)
                            ),
                            subActionProperties: (card) => ({ attachment: card, target: context.source, bisteca: 33 }),
                            gameAction: AbilityDsl.actions.attach(),
                            message: '{0} takes {1} and attaches it to {2}',
                            messageArgs: (card) => [context.source.controller, card, context.source]
                        })),
                        [choice.conflictDeck]: AbilityDsl.actions.deckSearch({
                            activePromptTitle: selectAttachmentPrompt,
                            deck: Decks.ConflictDeck,
                            reveal: true,
                            cardCondition: (card, context) => matchesSearchableCard(card, context),
                            selectedCardsHandler: (context, event, cards) => {
                                const card = cards[0];
                                if(!card) {
                                    return;
                                }

                                context.game.addMessage(attachMsg, event.player, card, context.source);
                                context.game.queueSimpleStep(() =>
                                    AbilityDsl.actions
                                        .attach({ target: context.source, attachment: card })
                                        .resolve(null, context)
                                );
                            }
                        })
                    },
                    messages: {
                        [choice.discardPile]: '{0} searches their discard pile',
                        [choice.conflictDeck]: '{0} searches their conflict deck'
                    }
                }),
                AbilityDsl.actions.cardLastingEffect((context) => {
                    const fetchedAttachment = context.source.attachments.first();
                    return {
                        target: fetchedAttachment,
                        condition: (context) => fetchedAttachment.parent === context.source,
                        duration: Durations.Custom,
                        effect: AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsCardAbilities',
                            applyingPlayer: context.player
                        })
                    };
                })
            ])
        });
    }
}

KitsukiMasanori.id = 'kitsuki-masanori';

module.exports = KitsukiMasanori;
