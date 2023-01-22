const AbilityDsl = require('../../../abilitydsl.js');
const { Elements, Locations } = require('../../../Constants.js');
const DrawCard = require('../../../drawcard.js');

const elementKey = 'ichigo-kun-fire';

class IchigoKun extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) =>
                context.game.currentConflict &&
                context.game.currentConflict.hasElement(
                    this.getCurrentElementSymbol(elementKey)
                ),
            effect: [
                AbilityDsl.effects.cannotParticipateAsAttacker(),
                AbilityDsl.effects.cannotParticipateAsDefender()
            ]
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'applyCovert',
                restricts: 'opponentsCardEffects'
            })
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyMilitarySkill(card => this.getSkillBonus(card))
        });

        this.reaction({
            title: 'Place fate per facedown province',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: AbilityDsl.actions.placeFate(context => ({
                target: context.source,
                amount: context.player.getProvinces(province => province.facedown && province.location !== Locations.StrongholdProvince).length
            }))
        });

        this.wouldInterrupt({
            title: 'Place discarded cards under this',
            when: {
                onCardsDiscardedFromHand: (event, context) => event.cards && event.cards.some(a => a.controller === context.player),
                onCardsDiscarded: (event, context) => event.cards && event.cards.some(a => a.controller === context.player && a.location === Locations.Hand)
            },
            limit: AbilityDsl.limit.perRound(Infinity),
            effect: 'place {1} underneath {0} instead of discarding them',
            effectArgs: context => context.event.cards.filter(a => a.controller === context.player && a.location === Locations.Hand),
            gameAction: AbilityDsl.actions.cancel(context => ({
                target: context.event.cards.filter(a => a.controller === context.player && a.location === Locations.Hand),
                replacementGameAction: AbilityDsl.actions.placeCardUnderneath({
                    destination: this
                })
            }))
        });
    }

    getSkillBonus(card) {
        return card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length;
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
