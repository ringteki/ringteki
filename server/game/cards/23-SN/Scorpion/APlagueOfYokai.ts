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
            condition: context => !!context.game.isDuringConflict() && this.getCopiesInDeck(context).length > 0,
            cost: AbilityDsl.costs.dishonor({
                controller: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isParticipating() && card.hasTrait('shinobi')
            }),
            target: {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => !!context.player.opponent &&
                    card.isParticipatingFor(context.player.opponent) &&
                    AbilityDsl.actions.attach().canAffect(card, context, { attachment: this.getCopiesInDeck(context)[0] }),
                gameAction: AbilityDsl.actions.multipleContext(context => ({
                    gameActions: [
                        AbilityDsl.actions.attach({
                            target: context.target,
                            attachment: this.getCopiesInDeck(context)[0]
                        }),
                        AbilityDsl.actions.shuffleDeck({
                            deck: Location.ConflictDeck,
                            target: context.player
                        })
                    ]
                }))
            },
            effect: 'infect {0}'
        });
    }

    getCopiesInDeck(context: AbilityContext) {
        const player = context.player as Player;
        return player.conflictDeck.filter(card => card.name === context.source.name);
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
