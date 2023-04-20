import { CardTypes, FavorTypes, Locations, Players } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import Player = require('../../../player');

export default class WhispersOfTheLordsOfDeath extends DrawCard {
    static id = 'whispers-of-the-lords-of-death';

    public setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: AbilityDsl.effects.changePlayerGloryModifier((player) => this.highestMilitaryForPlayer(player))
        });

        this.reaction({
            title: 'Put into play',
            location: [Locations.Hand],
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.card.type === CardTypes.Character && context.game.isDuringConflict()
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.putIntoPlay((context) => ({ target: context.source })),
                AbilityDsl.actions.claimImperialFavor((context) => ({
                    target: context.player,
                    side: FavorTypes.Military
                }))
            ]),
            effect: 'put {0} into play and claim the Imperial Favor'
        });
    }

    private highestMilitaryForPlayer(player: Player) {
        return (player.cardsInPlay as BaseCard[]).reduce((maxMil, card) => {
            if (card.type !== CardTypes.Character) {
                return maxMil;
            }

            const cardMil = card.getMilitarySkill();
            return cardMil > maxMil ? cardMil : maxMil;
        }, 0);
    }
}
