import { CardTypes, Locations, Players, TargetModes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ShosuroElektra extends DrawCard {
    static id = 'shosuro-elektra';

    setupCardAbilities() {
        this.action({
            title: '',
            condition: (context) => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.reveal(context => ({
                    target: context.player.getDynastyCardsInProvince(Locations.Provinces)
                })),
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose a character to put into the conflict.',
                    numCards: 1,
                    targets: true,
                    mode: TargetModes.Exactly,
                    optional: false,
                    cardType: CardTypes.Character,
                    location: [Locations.Provinces],
                    controller: Players.Self,
                    cardCondition: card => !card.facedown && card.allowGameAction('putIntoConflict', context),
                    message: '{0} puts {1} into play into the conflict, aiding Elektra with their mission.',
                    messageArgs: card => [context.player, card],
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.putIntoConflict(),
                        AbilityDsl.actions.cardLastingEffect(context => ({
                            target: context.target,
                            effect: AbilityDsl.effects.delayedEffect({
                                when: {
                                    onConflictFinished: () => context.target.location === Locations.PlayArea
                                },
                                message: '{0} retreats back into the shadows of the bottom of the deck.',
                                messageArgs: context => [context.source],
                                gameAction: AbilityDsl.actions.returnToDeck({ target: context.target, shuffle: false })
                            })
                        })),
                    ])
                }))
            ]),
        });
    }
}
