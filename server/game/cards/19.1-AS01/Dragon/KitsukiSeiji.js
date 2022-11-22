const DrawCard = require('../../../drawcard.js');
const { Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

const elementKey = 'kitsuki-seiji-water';

class KitsukiSeiji extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 1,
            effect: [
                AbilityDsl.effects.modifyMilitarySkill(+2),
                AbilityDsl.effects.modifyPoliticalSkill(-2)
            ]
        });
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 0,
            effect: [
                AbilityDsl.effects.modifyMilitarySkill(-2),
                AbilityDsl.effects.modifyPoliticalSkill(+2)
            ]
        });

        this.reaction({
            title: 'Gain fate',
            when: {
                onClaimRing: (event) => {
                    let targetElement =
                        this.getCurrentElementSymbol(elementKey);
                    return (
                        (event.conflict &&
                            event.conflict.hasElement(targetElement)) ||
                        event.ring.hasElement(targetElement)
                    );
                }
            },
            gameAction: AbilityDsl.actions.placeFate()
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Elements.Water
        });
        return symbols;
    }
}

KitsukiSeiji.id = 'kitsuki-seiji';

module.exports = KitsukiSeiji;
