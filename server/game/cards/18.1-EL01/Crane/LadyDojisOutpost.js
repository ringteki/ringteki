const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Players, CharacterStatus } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class LadyDojisOutpost extends StrongholdCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card.hasTrait('courtier') && card.isHonored,
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyPoliticalSkill(1)
        });

        this.reaction({
            title: 'Honor a character',
            cost: AbilityDsl.costs.bowSelf(),
            when: {
                onStatusTokenGained: (event, context) => {
                    const token = context.event.token.grantedStatus || context.event.token;
                    return event.card.controller === context.player && event.card !== context.source && token === CharacterStatus.Honored;
                }
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.hasTrait('courtier'),
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}

LadyDojisOutpost.id = 'lady-doji-s-outpost';

module.exports = LadyDojisOutpost;
