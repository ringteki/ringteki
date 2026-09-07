import { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import Player from '../../../Player.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class APlagueOfYokai extends DrawCard {
    static id = 'a-plague-of-yokai';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card, context) => -this.getSkillModifier(context))
        });
        this.whileAttached({
            effect: AbilityDsl.effects.attachmentPoliticalSkillModifier((card, context) => -this.getSkillModifier(context))
        });

        this.action({
            title: 'Spread the plague',
            condition: context => {
                if(!context.game.isDuringConflict()) {
                    return false;
                }
                if(!context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('shinobi'))) {
                    return false;
                }
                const { copiesInDeck, copiesInDiscard } = this.getCopies(context);
                if(copiesInDiscard.length === 0 && copiesInDeck.length === 0) {
                    return false;
                }

                return true;
            },
            target: {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => {
                    const { copiesInDeck, copiesInDiscard } = this.getCopies(context);
                    let attachment;
                    if(copiesInDeck.length > 0) {
                        attachment = copiesInDeck[0];
                    } else if(copiesInDiscard.length > 0) {
                        attachment = copiesInDiscard[0];
                    }
                    return card.isParticipating() && AbilityDsl.actions.attach().canAffect(card, context, { attachment });
                },
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.chooseAction((context) => {
                        const { copiesInDeck, copiesInDiscard } = this.getCopies(context);

                        let options = {};
                        if(copiesInDiscard.length > 0) {
                            const optionTitle = `Discard pile (${copiesInDiscard.length})`;
                            options = {
                                ...options,
                                [optionTitle]: {
                                    action: AbilityDsl.actions.attach({
                                        target: context.target,
                                        attachment: copiesInDiscard[0]
                                    }),
                                    message: '{0} takes from their discard pile'
                                }
                            };
                        }
                        if(copiesInDeck.length > 0) {
                            const optionTitle = `Deck (${copiesInDeck.length})`;
                            options = {
                                ...options,
                                [optionTitle]: {
                                    action: AbilityDsl.actions.multiple([
                                        AbilityDsl.actions.attach({
                                            target: context.target,
                                            attachment: copiesInDeck[0]
                                        }),
                                        AbilityDsl.actions.shuffleDeck({
                                            deck: Location.ConflictDeck,
                                            target: context.player
                                        })
                                    ]),
                                    message: '{0} takes from their deck'
                                }
                            };
                        }

                        return {
                            activePromptTitle: 'Select where to pull card from',
                            options
                        };
                    }),
                    AbilityDsl.actions.onAffinity(context => ({
                        trait: 'shadow',
                        gameAction: AbilityDsl.actions.noAction(),
                        noAffinityGameAction: AbilityDsl.actions.loseHonor({
                            target: context.player
                        }),
                        effect: 'prevent the honor loss'
                    }))
                ])
            },
            effect: 'infect {0} and lose 1 honor'
        });
    }

    getCopies(context: AbilityContext) {
        const player = context.player as Player;
        const copiesInDiscard = player.conflictDiscardPile.filter(card => card.name === context.source.name);
        const copiesInDeck = player.conflictDeck.filter(card => card.name === context.source.name);

        return { copiesInDiscard, copiesInDeck };
    }

    getSkillModifier(context: AbilityContext) {
        if(!context.game.currentConflict) {
            return 0;
        }

        const participatingCharacters = context.game.currentConflict.getParticipants();
        const attachments = participatingCharacters.reduce(
            (prev, current) => [...prev, ...current.attachments],
            [] as DrawCard[]
        );

        const matchingAttachments = attachments.filter(a => a.name === context.source.name && a.controller === context.source.controller);
        return matchingAttachments.length;
    }
}
