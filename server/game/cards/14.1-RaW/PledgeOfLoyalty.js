const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { CharacterStatus } = require('../../Constants.js');

class PledgeOfLoyalty extends ProvinceCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Prevent a character from leaving play',
            when: {
                onCardLeavesPlay: (event, context) => event.card.controller === context.player && event.card.isHonored
            },
            effect: 'prevent {1} from leaving play',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel(context => ({
                replacementGameAction: AbilityDsl.actions.discardStatusToken({ target: context.event.card.getStatusToken(CharacterStatus.Honored) })
            }))
        });
    }
}

PledgeOfLoyalty.id = 'pledge-of-loyalty';

module.exports = PledgeOfLoyalty;
