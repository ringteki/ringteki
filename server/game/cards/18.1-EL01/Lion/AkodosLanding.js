const StrongholdCard = require('../../../strongholdcard.js');
const { CardTypes, Players, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');
const Soldier = require('../../Soldier.js');

class AkodosLanding extends StrongholdCard {
    setupCardAbilities() {
        const DummyAttachment = new Soldier(this);

        this.action({
            title: 'Honor a character',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => card.attachments.size() === 0 && context.game.actions.attach({ attachment: DummyAttachment }).canAffect(card, context),
                gameAction: AbilityDsl.actions.handler({
                    handler: context => {
                        this.game.promptForSelect(context.player, {
                            activePromptTitle: 'Choose a card to turn into an attachment',
                            context: context,
                            location: Locations.Hand,
                            onSelect: (player, card) => {
                                let token = context.game.createToken(card, Soldier);
                                card.owner.removeCardFromPile(card);
                                card.moveTo(Locations.RemovedFromGame);
                                const moveEvents = [];
                                context.game.actions.attach({ target: context.target, attachment: token }).addEventsToArray(moveEvents, context);
                                context.game.openThenEventWindow(moveEvents);
                                return true;
                            }
                        });
                    }
                })
            }
        });
    }
}

AkodosLanding.id = 'akodo-s-landing';

module.exports = AkodosLanding;
