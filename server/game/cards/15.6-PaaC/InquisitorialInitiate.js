const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class InquisiorialInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard an opponent\'s card',
            when: {
                afterConflict: (event, context) => context.source.isParticipating() && event.conflict.winner === context.source.controller && context.player.opponent
            },
            target: {
                activePromptTitle: 'Choose cards to reveal',
                player: Players.Opponent,
                numCardsFunc: (context) => context.player.opponent.cardsInPlay.filter(card => card.getFate() === 0).length,
                mode: TargetModes.ExactlyVariable,
                location: Locations.Hand
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.lookAt(context => ({
                    target: context.target
                })),
                AbilityDsl.actions.cardMenu(context => ({
                    cards: context.target,
                    gameAction: AbilityDsl.actions.discardCard(),
                    message: '{0} chooses {1} to be discarded',
                    messageArgs: (card, player) => [player, card]
                }))
            ])
        });
    }
}

InquisiorialInitiate.id = 'inquisitorial-initiate';

module.exports = InquisiorialInitiate;
