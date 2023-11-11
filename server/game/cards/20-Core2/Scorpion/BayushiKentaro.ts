import { CardTypes, Durations, Locations, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class BayushiKentaro extends DrawCard {
    static id = 'bayushi-kentaro';

    setupCardAbilities() {
        this.action({
            title: 'Put a character into play',
            condition: (context) => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.reveal((context) => ({
                    target: context.player.getDynastyCardsInProvince(Locations.Provinces)
                })),
                AbilityDsl.actions.selectCard((context) => ({
                    activePromptTitle: 'Choose a character to put into the conflict',
                    numCards: 1,
                    targets: true,
                    mode: TargetModes.Exactly,
                    optional: false,
                    cardType: CardTypes.Character,
                    location: [Locations.Provinces],
                    controller: Players.Self,
                    cardCondition: (card) =>
                        !card.facedown &&
                        card.isFaction('scorpion') &&
                        card.allowGameAction('putIntoConflict', context),
                    message: '{0} puts {1} into play into the conflict, aiding {2} with their mission.',
                    messageArgs: (card) => [context.player, card, context.source],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.putIntoConflict(),
                        AbilityDsl.actions.cardLastingEffect((context) => ({
                            target: context.target,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onConflictFinished: () => context.target.location === Locations.PlayArea
                                },
                                message:
                                    '{1} returns to the bottom of the dynasty deck due to the delayed effect of {0}',
                                messageArgs: () => [context.source, context.target],
                                gameAction: AbilityDsl.actions.returnToDeck({ shuffle: false, bottom: true })
                            })
                        }))
                    ])
                }))
            ])
        });
    }
}
