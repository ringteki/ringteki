const DrawCard = require('../../drawcard.js');
const { Locations, Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class StokeInsurrection extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            condition: context => context.player.opponent && this.getFaceDownProvinceCards(context.player.opponent) >= 4,
            effect: AbilityDsl.effects.reduceCost({
                amount: () => {
                    return 2;
                },
                match: (card, source) => card === source
            })
        });

        this.action({
            title: 'Put characters into play',
            condition: context => context.game.isDuringConflict() && context.player.opponent,
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.reveal(context => ({
                    target: context.player.opponent.getDynastyCardsInProvince(Locations.Provinces)
                })),
                AbilityDsl.actions.selectCard(context => ({
                    activePromptTitle: 'Choose up to two characters',
                    numCards: 2,
                    targets: true,
                    mode: TargetModes.MaxStat,
                    cardStat: card => card.getCost(),
                    maxStat: () => 6,
                    optional: true,
                    cardType: CardTypes.Character,
                    location: [Locations.Provinces],
                    controller: Players.Opponent,
                    cardCondition: card => card.isFaceup() && card.allowGameAction('putIntoConflict', context),
                    message: '{0} puts {1} into play into the conflict',
                    messageArgs: cards => [context.player, cards],
                    gameAction: AbilityDsl.actions.putIntoConflict()
                }))
            ]),
            effect: 'reveal {1}\'s dynasty cards and put up to two of them into play',
            effectArgs: context => [context.player.opponent]
        });
    }

    getFaceDownProvinceCards(player) {
        return player
            .getDynastyCardsInProvince(Locations.Provinces)
            .filter(card => card.isFacedown() && card.controller === player).length;
    }
}

StokeInsurrection.id = 'stoke-insurrection';

module.exports = StokeInsurrection;
