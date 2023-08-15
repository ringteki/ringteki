import { CardTypes, Players } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class IsawaBruce extends DrawCard {
    static id = 'isawa-bruce';

    setupCardAbilities() {
        this.reaction({
            title: 'Discard an enemy character',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player &&
                    this.game.isDuringConflict() &&
                    event.card.hasTrait('fire') &&
                    event.card.hasTrait('spell')
            },
            target: {
                activePromptTitle: 'Choose a character',
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card: DrawCard, context) =>
                    card.isParticipating() && card.militarySkill <= (context.source as DrawCard).militarySkill,
                gameAction: AbilityDsl.actions.conditional({
                    condition: (context) => context.target.getFate() === 0,
                    trueGameAction: AbilityDsl.actions.discardFromPlay(),
                    falseGameAction: AbilityDsl.actions.removeFate()
                })
            }
        });
    }
}
