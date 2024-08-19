import AbilityDsl from '../../../abilitydsl';
import { CardTypes, Players } from '../../../Constants';
import DrawCard from '../../../drawcard';

export default class IkomaJack extends DrawCard {
    static id = 'ikoma-jack';

    setupCardAbilities() {
        this.action({
            title: 'Switch place with another character',
            condition: () => this.game.isDuringConflict(),
            target: {
                activePromptTitle: 'Choose a character to move to the conflict',
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => context.source.isParticipating() !== card.isParticipating(),
                gameAction: AbilityDsl.actions.joint([
                    AbilityDsl.actions.sendHome((context) => ({
                        target: context.source.isParticipating() ? context.source : context.target
                    })),
                    AbilityDsl.actions.moveToConflict((context) => ({
                        target: context.source.isParticipating() ? context.target : context.source
                    }))
                ])
            },
            effect: 'switch {1} and {2}',
            effectArgs: (context) => [context.source, context.target]
        });
    }
}