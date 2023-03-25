const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Players, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const { default: Soldier } = require('../../Soldier');

class Pride extends StrongholdCard {
    setupCardAbilities() {
        // @ts-ignore
        const DummyAttachment = new Soldier(this);

        this.action({
            title: 'Give a character a +1/+1 attachment',
            cost: AbilityDsl.costs.bowSelf(),
            condition: context => context.player.conflictDeck.size() > 0,
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.attachments.filter(a => a.hasTrait('follower')).length === 0 && context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context),
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        const card = context.player.conflictDeck.first();
                        let token = context.game.createToken(card, Soldier);
                        card.owner.removeCardFromPile(card);
                        card.moveTo(Locations.RemovedFromGame);
                        const moveEvents = [];
                        context.game.actions.attach({ target: context.target, attachment: token }).addEventsToArray(moveEvents, context);
                        context.game.openThenEventWindow(moveEvents);
                        return true;
                    }
                })
            },
            effect: 'attach the top card of their conflict deck to {0} as a +1/+1 attachment'
        });
    }
}

Pride.id = 'pride';

module.exports = Pride;
