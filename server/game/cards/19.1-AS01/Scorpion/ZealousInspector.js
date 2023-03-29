const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Durations } = require('../../../Constants');

class ZealousInspector extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Take an additional action',
            when: {
                onCardDishonored: (event, context) => {
                    const isCharacter = event.card.type === CardTypes.Character;
                    const controlledByAnOpponent =
                        event.card.controller === context.player.opponent;
                    const dishonoredByYourCardEffect =
                        context.player === event.context.player &&
                        event.context.source.type !== 'ring';

                    return (
                        isCharacter &&
                        controlledByAnOpponent &&
                        dishonoredByYourCardEffect
                    );
                }
            },
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                duration: Durations.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(1)
            })),
            effect:'gain an additional action — time to deliver swift punishment for the wicked'
        });
    }
}

ZealousInspector.id = 'zealous-inspector';

module.exports = ZealousInspector;
