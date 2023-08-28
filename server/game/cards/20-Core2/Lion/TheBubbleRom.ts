import { CardTypes, Locations, Players } from '../../../Constants';
import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class TheBubbleRom extends ProvinceCard {
    static id = 'the-bubble-room';

    setupCardAbilities() {
        this.action({
            title: 'Flip a dynasty card',
            condition: () => this.game.isDuringConflict('military'),
            cannotBeMirrored: true,
            effect: 'flip the card in the conflict province faceup',
            target: {
                controller: Players.Self,
                location: Locations.Provinces,
                cardCondition: (card) => card.isInConflictProvince() && card.isFacedown(),
                gameAction: AbilityDsl.actions.flipDynasty()
            },
            then: (context) => ({
                handler: () => {
                    const card = context.target;
                    if (card.type !== CardTypes.Character || !card.allowGameAction('putIntoConflict', context)) {
                        return this.game.addMessage('{0} is revealed but cannot be brought into the conflict!', card);
                    }

                    this.game.addMessage('{0} is revealed and brought into the conflict!', card);
                    AbilityDsl.actions.putIntoConflict().resolve(card, context);
                }
            })
        });
    }
}
