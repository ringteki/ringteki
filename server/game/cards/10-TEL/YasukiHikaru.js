const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants.js');

class YasukiHikaru extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Send home character',
            condition: (context) => context.source.isDefending(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getMilitarySkill() > context.source.getMilitarySkill(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}

YasukiHikaru.id = 'yasuki-hikaru';

module.exports = YasukiHikaru;
