const ProvinceCard = require('../../provincecard.js');
const AbilityDsl = require('../../abilitydsl');
const { TokenTypes } = require('../../Constants.js');

class FortifiedAssembly extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Place an honor token on this province',
            when: {
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            },
            gameAction: AbilityDsl.actions.addToken(),
            effect: 'put an honor token on {0}',
            effectArgs: (context) => context.source
        });
        this.persistentEffect({
            effect: AbilityDsl.effects.modifyProvinceStrength(() => this.getTokenCount(TokenTypes.Honor) * 2)
        });
    }

    cannotBeStrongholdProvince() {
        return true;
    }
}

FortifiedAssembly.id = 'fortified-assembly';

module.exports = FortifiedAssembly;
