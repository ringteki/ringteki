const DrawCard = require('../../../drawcard.js');
const { Elements } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl.js');

const elementKey = 'kitsuki-seiji-water';

class KitsukiSeiji extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 1,
            effect: [AbilityDsl.effects.modifyMilitarySkill(+2), AbilityDsl.effects.modifyPoliticalSkill(-2)]
        });
        this.persistentEffect({
            condition: (context) => context.player.showBid % 2 === 0,
            effect: [AbilityDsl.effects.modifyMilitarySkill(-2), AbilityDsl.effects.modifyPoliticalSkill(+2)]
        });

        this.wouldInterrupt({
            title: 'Put fate on this character',
            when: {
                onMoveFate: (event) => this.fateRecipientIsSeijisRing(event.recipient),
                onPlaceFateOnUnclaimedRings: (event) =>
                    event.recipients.some((recipient) => this.fateRecipientIsSeijisRing(recipient.ring))
            },
            effect: 'put the fate that would go on the {1} ring on {0} instead',
            effectArgs: () => [this.getCurrentElementSymbol(elementKey)],
            gameAction: AbilityDsl.actions.cancel((context) => {
                switch(context.event.name) {
                    case 'onPlaceFateOnUnclaimedRings':
                        return { replacementGameAction: this.replacementForPlaceFateOnUnclaimedRings(context) };
                    case 'onMoveFate':
                        return { replacementGameAction: this.replacementForMoveFate(context) };
                    default:
                        return { replacementGameAction: AbilityDsl.actions.noAction() };
                }
            })
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

    fateRecipientIsSeijisRing(recipient) {
        return recipient && recipient.type === 'ring' && recipient.hasElement(this.getCurrentElementSymbol(elementKey));
    }

    replacementForMoveFate(context) {
        return AbilityDsl.actions.placeFate({
            origin: context.event.origin,
            target: context.source,
            amount: context.event.fate
        });
    }

    replacementForPlaceFateOnUnclaimedRings(context) {
        return AbilityDsl.actions.joint(
            context.event.recipients.map((recipient) => {
                let isSeijisRing = recipient.ring.hasElement(this.getCurrentElementSymbol(elementKey));
                if(isSeijisRing) {
                    return AbilityDsl.actions.placeFate({
                        target: context.source,
                        amount: recipient.amount
                    });
                }
                return AbilityDsl.actions.placeFateOnRing({
                    amount: recipient.amount,
                    target: recipient.ring
                });

            })
        );
    }
}

KitsukiSeiji.id = 'kitsuki-seiji';

module.exports = KitsukiSeiji;
