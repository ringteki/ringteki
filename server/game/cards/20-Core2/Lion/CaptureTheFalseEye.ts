import { AbilityTypes, CardTypes, PlayTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class CaptureTheFalseEye extends DrawCard {
    static id = 'capture-the-false-eye';

    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: (context) => context.game.isDuringConflict('military'),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() &&
                    this.game.currentConflict
                        .getCharacters(context.player)
                        .some(
                            (myCard: DrawCard) => myCard.hasTrait('bushi') && myCard.militarySkill > card.militarySkill
                        ),
                gameAction: [
                    AbilityDsl.actions.bow(),
                    AbilityDsl.actions.playerLastingEffect((context) => ({
                        targetController: context.player,
                        effect: AbilityDsl.effects.gainAbility(AbilityTypes.Persistent, {
                            targetController: Players.Self,
                            effect: AbilityDsl.effects.increaseCost({
                                amount: 1,
                                playingType: PlayTypes.PlayFromHand,
                                match: (card: DrawCard) => card.type === CardTypes.Event
                            })
                        })
                    }))
                ]
            }
        });
    }
}
