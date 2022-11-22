const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes } = require('../../../Constants.js');

class NamelessBrother extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (card, context) =>
                card.controller === context.player &&
                card.type === CardTypes.Character,
            effect: AbilityDsl.effects.modifyBothSkills(
                (character, context) =>
                    context.player.cardsInPlay.filter(
                        (otherCard) =>
                            otherCard.name === character.name &&
                            otherCard.uuid !== character.uuid &&
                            otherCard.type === CardTypes.Character
                    ).length
            )
        });
    }
}

NamelessBrother.id = 'nameless-brother';

module.exports = NamelessBrother;
