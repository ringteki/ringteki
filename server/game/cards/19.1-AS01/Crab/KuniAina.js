const DrawCard = require('../../../drawcard.js');
const { CardTypes, Players, Phases } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

class KuniAina extends DrawCard {
    setupCardAbilities() {
        this.cannotPayHonorCostsEffect();

        this.persistentEffect({
            targetController: Players.Any,
            match: (card) =>
                card.type === CardTypes.Character &&
                (card.isTainted || card.hasTrait('shadowlands') || card.hasTrait('haunted')),
            effect: AbilityDsl.effects.modifyBothSkills(-2)
        });

        this.action({
            title: 'Taint a character',
            effect: 'identify the source of Crab\'s misfortune… it is {0}! {0} is tainted.',
            phase: Phases.Conflict,
            condition: (context) =>
                context.player.opponent && context.player.hand.size() <= context.player.opponent.hand.size(),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.taint()
            }
        });
    }

    cannotPayHonorCostsEffect() {
        this.persistentEffect({
            effect: AbilityDsl.effects.playerCannot({ cannot: 'loseHonor', restricts: 'loseHonorAsCost' })
        });

        /**
         * Shortcut to handle tainted characters.
         * Ideally it would be integrated when generating the conflict matrix etc.
         * Without this Tainted character get stopped from commiting into the conflict, but the declaration goes through
         */
        this.persistentEffect({
            match: (card) => card.controller === this.controller && card.isTainted,
            effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
        });
        this.persistentEffect({
            match: (card) => card.controller === this.controller && card.isTainted,
            effect: AbilityDsl.effects.cardCannot('declareAsDefender')
        });
    }
}

KuniAina.id = 'kuni-aina';

module.exports = KuniAina;
