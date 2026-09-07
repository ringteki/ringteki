import { AbilityType, CardType, Duration, EffectName, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { GameAction } from '../../../GameActions/GameAction.js';
import { AbilityContext } from '../../../AbilityContext.js';

export default class LoyalWarhound extends DrawCard {
    static id = 'loyal-warhound';

    setupCardAbilities() {
        const DummyHoundAttachment = new DrawCard(this.owner, {
            cost: '0',
            glory: '0',
            side: 'dynasty',
            text: '',
            type: 'attachment',
            name: 'War Hound',
            id: 'loyal-warhound',
            traits: ['creature']
        });

        this.action({
            title: 'Attach this to a character',
            condition: context => context.source.type === CardType.Character,
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    context.game.actions.attach({ attachment: DummyHoundAttachment }).canAffect(card, context) && card !== context.source
            },
            gameAction: AbilityDsl.actions.sequentialContext(context => {
                const gameActions: GameAction[] = [];

                gameActions.push(AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    duration: Duration.Custom,
                    until: {
                        onCardDetached: event => event.card === context.source,
                        onCardLeavesPlay: event => event.card === context.target
                    },
                    effect: [
                        AbilityDsl.effects.blank(true),
                        AbilityDsl.effects.changeType(CardType.Attachment),
                        AbilityDsl.effects.gainAbility(AbilityType.Action, {
                            title: 'Detatch',
                            condition: (context: AbilityContext<DrawCard>) => {
                                const flags = context.source.getEffects(EffectName.AddFlag);
                                return !flags.includes('wasAttachedThisRound');
                            },
                            printedAbility: false,
                            effect: 'detatch itself',
                            gameAction: AbilityDsl.actions.detach((context) => ({ target: context.source }))
                        })
                    ]
                }));

                gameActions.push(AbilityDsl.actions.cardLastingEffect({
                    target: context.target,
                    duration: Duration.Custom,
                    condition: () => !!context.target?.hasTrait('scout') && (context.source as DrawCard).parent === context.target,
                    until: {
                        onCardDetached: event => event.card === context.source
                    },
                    effect: [
                        AbilityDsl.effects.cardCannot({
                            cannot: 'target',
                            restricts: 'opponentsProvinceEffects',
                            source: context.source
                        })
                    ]
                }));

                gameActions.push(AbilityDsl.actions.cardLastingEffect({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: AbilityDsl.effects.addFlag('wasAttachedThisRound')
                }));

                gameActions.push(AbilityDsl.actions.attach({
                    attachment: this,
                    target: context.target,
                    wasACharacter: true
                }));

                return { gameActions };
            }),
            effect: 'attach itself to {0}'
        });
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
