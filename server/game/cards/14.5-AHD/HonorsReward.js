const ProvinceCard = require('../../provincecard.js');
const { Players, CardTypes, Elements} = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HonorsReward extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'give target character +3 glory',
            conflictProvinceCondition: province => province.isElement(Elements.Fire),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating(),
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    effect: AbilityDsl.effects.modifyGlory(3)
                }))
            },
            effect: 'give {0} +3 glory'
        });
    }
}

HonorsReward.id = 'honor-s-reward';

module.exports = HonorsReward;
