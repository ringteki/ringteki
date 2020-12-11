const BattlefieldAttachment = require('../BattlefieldAttachment');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, Phases } = require('../../Constants');

class FieldOfRuin extends BattlefieldAttachment {
    setupCardAbilities() {
        super.setupCardAbilities();

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: target => target.type === CardTypes.Province && target.isBroken,
                match: (card, source) => card === source
            })
        });

        this.reaction({
            title: 'discard each card in attached province',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            gameAction: AbilityDsl.actions.discardCard(context => ({
                target: context.source.parent && context.source.parent.controller.getDynastyCardsInProvince(context.source.parent.location)
            })),
            effect: 'discard each card in the attached province'
        });
    }

    unbrokenOnly() {
        return false;
    }
}

FieldOfRuin.id = 'field-of-ruin';

module.exports = FieldOfRuin;
