const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Locations, Players, Phases } = require('../../Constants');

class FieldOfRuin extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'battlefield': 1 }
        });
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
                target: context.source.parent.controller.getDynastyCardsInProvince(context.source.parent.location)
            })),
            effect: 'discard each card in the attached province'
        });
    }

    canPlayOn(source) {
        return source && source.getType() === 'province' && this.getType() === CardTypes.Attachment;
    }

    canAttach(parent) {
        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

FieldOfRuin.id = 'field-of-ruin';

module.exports = FieldOfRuin;
