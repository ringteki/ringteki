const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, Durations, Phases, Locations, Decks, Players } = require('../../Constants');

class MasterpiecePainter extends DrawCard {
    setupCardAbilities() {
        const revealAndMayPlayAbility = revealAndMayPlay.bind(this);

        this.action({
            title: 'Reveal and may play top conflict card',
            target: {
                mode: TargetModes.Select,
                targets: true,
                activePromptTitle: 'Choose any number of players',
                choices: {
                    [this.controller.name]: revealAndMayPlayAbility('me'),
                    [this.controller.opponent && this.controller.opponent.name || 'NA']: revealAndMayPlayAbility('opponent'),
                    [this.controller.name + ' and ' + (this.controller.opponent && this.controller.opponent.name || 'NA')]: AbilityDsl.actions.multiple([
                        revealAndMayPlayAbility('me'),
                        revealAndMayPlayAbility('opponent')
                    ])
                }
            },
            effect: 'make {1} reveal the top card of their deck. They may play their card until the end of the phase.',
            effectArgs: context => context.select
        });
    }
}

const revealAndMayPlay = (player) => AbilityDsl.actions.playerLastingEffect(context => {
    let chosenPlayer = player === 'me' ? context.player : context.player.opponent;
    let topCard = chosenPlayer.conflictDeck.first();
    return {
        targetController: player === 'me' ? Players.Self : Players.Opponent,
        duration: Durations.Custom,
        until: {
            onCardMoved: event => event.card === topCard && event.originalLocation === Locations.ConflictDeck,
            onPhaseEnded: () => true,
            onDeckShuffled: event => event.player === chosenPlayer && event.deck === Decks.ConflictDeck
        },
        effect: [
            AbilityDsl.effects.showTopConflictCard(),
            AbilityDsl.effects.canPlayFromOwn(Locations.ConflictDeck, [topCard])
        ]
    };
});

MasterpiecePainter.id = 'masterpiece-painter';

module.exports = MasterpiecePainter;
