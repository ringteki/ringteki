const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, Locations, EventNames } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');
const EventRegistrar = require('../../../eventregistrar.js');

const elementKey = 'ichigo-kun-fire';
const MAXIMUM_FATE_GAIN_PER_ICHIG_ABILITY = 1;

class IchigoKun extends DrawCard {
    setupCardAbilities() {
        this.fateGainedThisRoundByIchigoAbility = 0;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnRoundEnded]);

        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict &&
                context.game.currentConflict.hasElement(this.getCurrentElementSymbol(elementKey)),
            effect: [AbilityDsl.effects.cannotParticipateAsAttacker(), AbilityDsl.effects.cannotParticipateAsDefender()]
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill((card) => this.getSkillBonus(card))
        });

        this.wouldInterrupt({
            title: 'Place discarded cards under this',
            when: {
                onCardsDiscardedFromHand: (event, context) =>
                    context.source.isParticipating() && event.context.source.type !== 'ring',
                onCardsDiscarded: (event, context) =>
                    context.source.isParticipating() &&
                    event.cards &&
                    event.cards.some((card) => this.isCardDiscardedFromHand(card))
            },
            limit: AbilityDsl.limit.perRound(Infinity),
            effect: 'place {1} underneath {0} instead of letting them be discarded{2} - tasty!',
            effectArgs: (context) => [
                context.event.cards.filter((card) => this.isCardDiscardedFromHand(card)),
                this.fateGainedThisRoundByIchigoAbility < MAXIMUM_FATE_GAIN_PER_ICHIG_ABILITY
                    ? ' and place 1 fate on Ichigo-kun'
                    : ''
            ],
            gameAction: AbilityDsl.actions.cancel((context) => ({
                replacementGameAction: AbilityDsl.actions.placeCardUnderneath({
                    destination: context.source,
                    target: context.event.cards.filter((card) => this.isCardDiscardedFromHand(card))
                })
            })),
            then: () => {
                let shouldGainFate = this.fateGainedThisRoundByIchigoAbility < MAXIMUM_FATE_GAIN_PER_ICHIG_ABILITY;
                this.fateGainedThisRoundByIchigoAbility++;
                return {
                    gameAction: shouldGainFate
                        ? AbilityDsl.actions.placeFate({ target: this })
                        : AbilityDsl.actions.noAction()
                };
            }
        });
    }

    getSkillBonus(card) {
        return card.game.allCards.filter((card) => card.location === this.uuid).length;
    }

    isCardDiscardedFromHand(card) {
        return card.location === Locations.Hand;
    }

    onRoundEnded() {
        this.fateGainedThisRoundByIchigoAbility = 0;
    }

    getPrintedElementSymbols() {
        let symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: elementKey,
            prettyName: 'Restricted Ring',
            element: Elements.Fire
        });
        return symbols;
    }
}

IchigoKun.id = 'ichigo-kun';

module.exports = IchigoKun;
