import { Locations, Players, PlayTypes, CardTypes } from '../../../Constants';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');
import Player = require('../../../player');

export default class DisloyalOathkeeper extends DrawCard {
    static id = 'disloyal-oathkeeper';

    public setupCardAbilities() {
        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: (card) => card.location === this.uuid,
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(
                    (player: Player) => player === this.controller,
                    PlayTypes.PlayFromHand
                ),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.reaction({
            title: 'Put card under this',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    event.card.type === CardTypes.Event &&
                    context.source.controller.getSourceList(this.uuid).size() === 0
            },
            gameAction: AbilityDsl.actions.placeCardUnderneath((context) => ({
                target: context.event.card,
                hideWhenFaceup: true,
                destination: this
            }))
        });
    }
}
