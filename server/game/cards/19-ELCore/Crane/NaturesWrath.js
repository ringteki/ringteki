const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl.js');
const { CardTypes, Locations } = require('../../../Constants');

class NaturesWrath extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Put this into the conflict',
            location: Locations.Provinces,
            when: {
                onCardRevealed: (event, context) => event.card.isProvince && event.card.controller === context.player && context.game.isDuringConflict('military')
            },
            gameAction: AbilityDsl.actions.putIntoConflict()
        });

        this.action({
            title: 'Give someone -2 military',
            condition: context => context.source.isParticipating(),
            cost: AbilityDsl.costs.payFate(1),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyMilitarySkill(-2)
                    }),
                    AbilityDsl.actions.dishonor(context => ({
                        target: context.target.getMilitarySkill() <= 0 ? context.target : []
                    }))
                ])
            },
            effect: 'give {0} -2{1}{2}',
            effectArgs: context => ['military', context.target.getMilitarySkill() <= 2 ? ' and dishonor them' : ''],
            anyPlayer: true,
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }
}

NaturesWrath.id = 'nature-s-wrath';

module.exports = NaturesWrath;
