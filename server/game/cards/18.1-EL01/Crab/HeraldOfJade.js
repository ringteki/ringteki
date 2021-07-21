const DrawCard = require('../../../drawcard.js');
const { TargetModes, CardTypes, Locations } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class HeraldOfJade extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Discard a status token off a character',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.Token,
                cardType: [CardTypes.Character, CardTypes.Province],
                location: Locations.Any,
                gameAction: AbilityDsl.actions.discardStatusToken()
            },
            effect: 'discard {1}\'s {2}',
            effectArgs: context => [
                context.token[0].card,
                context.token
            ]
        });
    }
}

HeraldOfJade.id = 'herald-of-jade';

module.exports = HeraldOfJade;
