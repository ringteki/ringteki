import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class GetOfYourHighHorse extends DrawCard {
    static id = 'get-off-your-high-horse-';

    setupCardAbilities() {
        this.action({
            title: 'Give -3 Political to a character',
            condition: (context) =>
                this.game.isDuringConflict('political') &&
                context.player.cardsInPlay.some((card: DrawCard) => card.isParticipating()),
            target: {
                cardCondition: (card, context) => {
                    const participants = context.game.currentConflict.getParticipants();
                    return (
                        participants.includes(card) &&
                        card.getGlory() === Math.max(...participants.map((c: DrawCard) => c.getGlory()))
                    );
                },
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyPoliticalSkill(-3)
                }))
            },
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
