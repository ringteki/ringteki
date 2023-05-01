import { CardTypes, Locations, Players, PlayTypes } from '../../../Constants';
import { PlayCharacterAsIfFromHandIntoConflict } from '../../../PlayCharacterAsIfFromHand';
import { PlayDisguisedCharacterAsIfFromHandIntoConflict } from '../../../PlayDisguisedCharacterAsIfFromHand';
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');

export default class ScoutsSteed extends DrawCard {
    static id = 'scout-s-steed';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.reaction({
            title: 'Pick a character to be able to play',
            when: {
                onConflictDeclared: (event, context) =>
                    context.source.parent && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) =>
                    context.source.parent && event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => context.source.parent && event.card === context.source.parent
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.playCard((context) => ({
                    target: context.target,
                    source: this,
                    resetOnCancel: false,
                    playType: PlayTypes.PlayFromHand,
                    playAction: context.target
                        ? [
                              new PlayCharacterAsIfFromHandIntoConflict(context.target),
                              new PlayDisguisedCharacterAsIfFromHandIntoConflict(context.target)
                          ]
                        : undefined,
                    ignoredRequirements: ['phase']
                }))
            },
            effect: 'play {0} into the conflict'
        });
    }
}
