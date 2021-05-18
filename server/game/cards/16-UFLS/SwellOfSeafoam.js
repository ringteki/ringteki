const DrawCard = require('../../drawcard.js');
import { CardTypes, Players } from '../../Constants.js';
const AbilityDsl = require('../../abilitydsl.js');
const EventRegistrar = require('../../eventregistrar');

class SwellOfSeafoam extends DrawCard {
    setupCardAbilities() {
        this.kihoPlayedThisConflict = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished', 'onCardPlayed']);

        this.action({
            title: 'Prevent opponent\'s bow and send home effects',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: card => card.isParticipating() && card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect(({
                        effect: AbilityDsl.effects.doesNotBow()
                    })),
                    AbilityDsl.actions.honor(context => ({
                        target: this.isKihoPlayed(context) ? context.target : []
                    }))
                ])
            },
            effect: '{1}prevent {0} from bowing at the end of the conflict',
            effectArgs: (context) => [this.isKihoPlayed(context) ? 'honor and ' : '']
        });
    }

    //in case there's a "You are considered to have played a kiho" effect printed at some point, you can put that in here
    isKihoPlayed(context) { // eslint-disable-line no-unused-vars
        return this.kihoPlayedThisConflict;
    }

    onConflictFinished() {
        this.kihoPlayedThisConflict = false;
    }

    onCardPlayed(event) {
        if(event && event.context.player === this.controller && event.context.source.hasTrait('kiho')) {
            this.kihoPlayedThisConflict = true;
        }
    }
}

SwellOfSeafoam.id = 'swell-of-seafoam';

module.exports = SwellOfSeafoam;
