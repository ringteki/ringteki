const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class DisguisedProtector extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Add each players honor bid to their skill total',
            condition: context => context.source.isParticipating(),
            effect: 'add the bid on each players dial to their skill total',
            gameAction: [
                ability.actions.playerLastingEffect(context => ({
                    effect: ability.effects.changePlayerSkillModifier(context.player.showBid)
                })),
                ability.actions.playerLastingEffect(context => ({
                    condition: context => context.player.opponent,
                    targetController: Players.Opponent,
                    effect: ability.effects.changePlayerSkillModifier(context.player.opponent ? context.player.opponent.showBid : 0)
                }))
            ]
        });
    }
}

DisguisedProtector.id = 'disguised-protector';

module.exports = DisguisedProtector;
