const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players, FavorTypes, Locations } = require('../../../Constants.js');

class WhispersOfTheLordsOfDeath extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            targetController: Players.Any,
            effect: AbilityDsl.effects.changePlayerGloryModifier((player) => this._whispersGloryCountBonus(player))
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

    _whispersGloryCountBonus(player) {
        return player.cardsInPlay.reduce((maxMil, card) => {
            if(card.type !== CardTypes.Character) {
                return maxMil;
            }

            let cardMil = card.getMilitarySkill();
            return cardMil > maxMil ? cardMil : maxMil;
        }, 0);
    }
}

WhispersOfTheLordsOfDeath.id = 'whispers-of-the-lords-of-death';

module.exports = WhispersOfTheLordsOfDeath;
