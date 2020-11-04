const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const EventRegistrar = require('../../eventregistrar.js');
const { EventNames } = require('../../Constants');


class MotoChagatai extends DrawCard {
    setupCardAbilities() {
        this.provinceBroken = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnBreakProvince, EventNames.OnConflictFinished]);

        this.persistentEffect({
            condition: context => (
                context.source.isAttacking() &&
                context.game.currentConflict &&
                context.game.currentConflict.conflictProvince &&
                context.game.currentConflict.conflictProvince.controller !== context.source.controller &&
                this.provinceBroken
            ),
            effect: AbilityDsl.effects.doesNotBow()
        });
    }

    onBreakProvince() {
        this.provinceBroken = true;
    }

    onConflictFinished() {
        this.provinceBroken = false;
    }
}

MotoChagatai.id = 'moto-chagatai';

module.exports = MotoChagatai;
