import { Location, PlayType } from '../../../Constants.js';
import { PlayCharacterAsIfFromHand } from '../../../PlayCharacterAsIfFromHand.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiHiroteru extends DrawCard {
    static id = 'daidoji-hiroteru';

    public setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.source.isDishonored,
            targetLocation: Location.Provinces,
            match: (card: DrawCard) => card.isDynasty && card.isFaceup() && card.hasSomeTrait('scout', 'shinobi'),
            effect: AbilityDsl.effects.gainPlayAction(PlayCharacterAsIfFromHand),
        });

        this.persistentEffect({
            condition: context => context.source.isDishonored,
            effect: AbilityDsl.effects.reduceCost({
                match: card => card.isDynasty && card.isFaceup() && card.hasSomeTrait('scout', 'shinobi'),
                playingTypes: PlayType.PlayFromHand
            })
        });

        this.action({
            title: 'Give skill bonus',
            condition: context => context.source.isParticipating(),
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.game.currentConflict?.getCharacters(context.player) ?? [],
                effect: AbilityDsl.effects.modifyBothSkills(1)
            })),
            effect: 'give {1} +1/+1',
            effectArgs: context => [context.game.currentConflict?.getCharacters(context.player)]
        });
    }
}
