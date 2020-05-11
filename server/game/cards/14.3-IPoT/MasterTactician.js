const DrawCard = require('../../drawcard.js');
const { Locations, CardTypes, PlayTypes, Players } = require('../../Constants');
const PlayDisguisedCharacterAction = require('../../PlayDisguisedCharacterAction.js');
const AbilityDsl = require('../../abilitydsl.js');
const PlayCharacterAction = require('../../playcharacteraction');

class MasterTactician extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetLocation: Locations.ConflictDeck,
            match: (card, context) => {
                return context && card === context.player.conflictDeck.first();
            },
            effect: [
                AbilityDsl.effects.hideWhenFaceUp()
            ]
        });

        this.persistentEffect({
            condition: context => context.source.isParticipating(),
            targetController: Players.Self,
            effect: AbilityDsl.effects.showTopDynastyCard()
        });
    }
}

MasterTactician.id = 'master-tactician';

module.exports = MasterTactician;
