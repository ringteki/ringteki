const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');

class TheArtOfPeace extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Honor all defenders and dishonor all attackers',
            when: {
                onBreakProvince: (event, context) => event.card === context.source
            },
            effect: 'dishonor all attackers and honor all defenders in this conflict',
            gameAction: [
                AbilityDsl.actions.dishonor(context => ({ target: context.event.conflict.getAttackers() })),
                AbilityDsl.actions.honor(context => ({ target: context.event.conflict.getDefenders() }))
            ]
        });
    }
}

TheArtOfPeace.id = 'the-art-of-peace';

module.exports = TheArtOfPeace;
