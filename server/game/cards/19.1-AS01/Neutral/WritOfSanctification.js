const DrawCard = require('../../../drawcard.js');
const { AbilityTypes, CardTypes, Players, TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');

class WritOfSanctification extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { 'title': 1 },
            trait: 'shugenja'
        });

        this.persistentEffect({
            condition: context => !context.player.cardsInPlay.some(card => (card.hasTrait('shadowlands') || card.hasTrait('haunted'))
                && card.type === CardTypes.Character),
            effect: AbilityDsl.effects.addKeyword('ancestral')
        });

        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Bow shadowlands or haunted',
                condition: context => context.source.isParticipating(),
                target: {
                    cardType: CardTypes.Character,
                    controller: Players.Any,
                    mode: TargetModes.Single,
                    cardCondition: card => card.isParticipating() && (card.hasTrait('haunted') || card.hasTrait('shadowlands')),
                    gameAction: AbilityDsl.actions.bow()
                }
            })
        });
    }
}

WritOfSanctification.id = 'writ-of-sanctification';

module.exports = WritOfSanctification;
