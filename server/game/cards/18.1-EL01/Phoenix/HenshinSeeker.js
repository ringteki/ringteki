const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, Players, CardTypes, Durations } = require('../../../Constants.js');

const elementKey = 'henshin-seeker-fire';

class HenshinSeeker extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            limit: AbilityDsl.limit.perRound(2),
            when: {
                onClaimRing: (event, context) => ((event.conflict && event.conflict.hasElement(this.getCurrentElementSymbol(elementKey))) || event.ring.hasElement(this.getCurrentElementSymbol(elementKey))) && event.player === context.player
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: card => card.hasTrait('monk'),
                gameAction: AbilityDsl.actions.honor()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                duration: Durations.UntilEndOfPhase,
                target: context.player.cardsInPlay.filter(card => card.isFaction('phoenix')),
                effect: AbilityDsl.effects.cardCannot('receiveDishonorToken')
            })),
            effect: 'honor {0} and prevent {1} from receiving dishonored status tokens this phase',
            effectArgs: context => [context.player.cardsInPlay.filter(card => card.isFaction('phoenix'))]
        });
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

HenshinSeeker.id = 'henshin-seeker';
module.exports = HenshinSeeker;
