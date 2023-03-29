const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const { CardTypes, Players } = require('../../../Constants.js');

class AncientStoneGuardian extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            effect: [AbilityDsl.effects.cardCannot('declareAsAttacker')]
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({ cannot: 'applyCovert', restricts: 'opponentsCardEffects' })
        });

        this.forcedInterrupt({
            title: 'Dishonor a character and draw a card',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            targets: {
                firstCharacter: {
                    activePromptTitle: 'Choose a character',
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    controller: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    player: (context) => (context.player.firstPlayer ? Players.Self : Players.Opponent),
                    cardCondition: (card, context) => this._stoneGuardianCardCondition(card, context),
                    gameAction: AbilityDsl.actions.sequentialContext((context) =>
                        this._stoneGuardianSequence(context.targets.firstCharacter)
                    )
                },
                secondCharacter: {
                    activePromptTitle: 'Choose a character',
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    controller: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                    player: (context) => (context.player.firstPlayer ? Players.Opponent : Players.Self),
                    cardCondition: (card, context) => this._stoneGuardianCardCondition(card, context),
                    gameAction: AbilityDsl.actions.sequentialContext((context) =>
                        this._stoneGuardianSequence(context.targets.secondCharacter)
                    )
                }
            },

            effect: 'present an opportunity to sneak around {0} and find some secrets!{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}',
            effectArgs: (context) =>
                this._stoneGuardianEffectParts(context.targets.firstCharacter).concat(
                    this._stoneGuardianEffectParts(context.targets.secondCharacter)
                )
        });
    }

    _stoneGuardianCardCondition(card, context) {
        return card !== context.source && AbilityDsl.actions.dishonor({ target: card }).canAffect(card, context);
    }

    _stoneGuardianSequence(target) {
        return {
            gameActions: [
                AbilityDsl.actions.dishonor({ target: target }),
                AbilityDsl.actions.draw({ target: target.controller })
            ]
        };
    }

    _stoneGuardianEffectParts(target) {
        if(target instanceof DrawCard) {
            // Target selected
            return [' ', target.controller, ' dishonors ', target, ' to draw a card.'];
        }
        // Target skipped
        return ['', '', '', '', ''];

    }
}

AncientStoneGuardian.id = 'ancient-stone-guardian';

module.exports = AncientStoneGuardian;
