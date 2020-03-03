const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { Phases, Players } = require('../../Constants');

class CityOfTheRichFrog extends ProvinceCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase !== 'setup',
            effect: AbilityDsl.effects.refillProvinceTo(3)
        });

        this.persistentEffect({
            targetController: Players.Self,
            effect: AbilityDsl.effects.playerDelayedEffect({
                when: {
                    onPhaseEnded: event => event.phase === Phases.Setup
                },
                message: '{0} fills to 3 cards!',
                messageArgs: effectContext => [effectContext.source],
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.player.dynastyDeck.first(),
                        destination: context.source.location
                    })),
                    AbilityDsl.actions.moveCard(context => ({
                        target: context.player.dynastyDeck.first(),
                        destination: context.source.location
                    }))
                ])
            })
        });
    }
}

CityOfTheRichFrog.id = 'city-of-the-rich-frog';

module.exports = CityOfTheRichFrog;
