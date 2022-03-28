const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Players, Locations, PlayTypes } = require('../../../Constants');
const PlayDynastyAsConflictCharacterAction = require('../../../playdynastycharacterasconflictaction');

class ScoutsSteed extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true
        });

        this.reaction({
            title: 'Pick a character to be able to play',
            when: {
                onConflictDeclared: (event, context) => context.source.parent && event.attackers.includes(context.source.parent),
                onDefendersDeclared: (event, context) => context.source.parent && event.defenders.includes(context.source.parent),
                onMoveToConflict: (event, context) => context.source.parent && event.card === context.source.parent
            },
            target: {
                cardType: CardTypes.Character,
                location: Locations.Provinces,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.playCard(context => ({
                    target: context.target,
                    source: this,
                    resetOnCancel: false,
                    playType: PlayTypes.PlayFromHand,
                    playAction: context.target ? new PlayDynastyAsConflictCharacterAction(context.target, true) : undefined,
                    ignoredRequirements: ['phase']
                }))
            },
            effect: 'play {0} into the conflict'
        });
    }
}

ScoutsSteed.id = 'scout-s-steed';
module.exports = ScoutsSteed;
