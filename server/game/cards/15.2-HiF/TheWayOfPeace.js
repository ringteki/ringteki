const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { TargetModes, CardTypes, Players } = require('../../Constants.js');

class TheWayOfPeace extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'honor up to 3 characters',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            target: {
                mode: TargetModes.UpTo,
                numCards: 3,
                cardType: CardTypes.Character,
                controller: Players.Any,
                player: Players.Self
            },
            gameAction: AbilityDsl.actions.honor(context => ({
                target: context.target
            }))
        });
    }
}

TheWayOfPeace.id = 'the-way-of-peace';

module.exports = TheWayOfPeace;
