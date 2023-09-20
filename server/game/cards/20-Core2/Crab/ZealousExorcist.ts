import { CardTypes, EventNames, Locations } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

export default class ZealousExorcist extends DrawCard {
    static id = 'zealous-exorcist';

    private charactersPlayedThisConflict = new Set<DrawCard>();
    private eventRegistrar?: EventRegistrar;

    public setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnConflictStarted, EventNames.OnCharacterEntersPlay]);

        this.action({
            title: 'Remove a character from play',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card: DrawCard) => this.charactersPlayedThisConflict.has(card),
                gameAction: AbilityDsl.actions.removeFromGame()
            }
        });
    }

    public onConflictStarted() {
        this.charactersPlayedThisConflict.clear();
    }

    public onCharacterEntersPlay(event: any) {
        if (event.originalLocation === Locations.Hand) {
            this.charactersPlayedThisConflict.add(event.card);
        }
    }
}
