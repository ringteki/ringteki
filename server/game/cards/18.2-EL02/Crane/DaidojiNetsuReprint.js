const DrawCard = require('../../../drawcard.js');
const { Players, CardTypes, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class DaidojiNetsuReprint extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: () => this.game.currentPhase === Phases.Conflict,
            targetController: Players.Self,
            match: (card, context) => card.getType() === CardTypes.Character && card !== context.source,
            effect: [
                AbilityDsl.effects.cardCannot({
                    cannot: 'leavePlay',
                    restricts: 'opponentsCardEffects'
                })
            ]
        });
    }
}

DaidojiNetsuReprint.id = 'daidoji-not-su';

module.exports = DaidojiNetsuReprint;

