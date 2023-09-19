import { CardTypes, Durations, Locations, Players } from '../../../Constants';
import type TriggeredAbilityContext from '../../../TriggeredAbilityContext';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class MotoOktai extends DrawCard {
    static id = 'moto-oktai';

    setupCardAbilities() {
        this.interrupt({
            title: "Increase this character's skill",
            when: {
                onCardLeavesPlay: ({ card }, context) =>
                    card.location === Locations.PlayArea &&
                    card.type === CardTypes.Character &&
                    card.controller === context.player &&
                    this.game.isDuringConflict()
            },
            effect: 'get +{1} {2}',
            effectArgs: (context) => [this.#skillBonus(context), 'military'],
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.modifyMilitarySkill(this.#skillBonus(context))
            }))
        });

        this.action({
            title: 'Discard a character from play',
            condition: (context) => context.source.isParticipatingFor(context.player),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                gameAction: AbilityDsl.actions.discardFromPlay()
            }
        });
    }

    #skillBonus(context: TriggeredAbilityContext) {
        return (context.event.card as DrawCard).getMilitarySkill();
    }
}
