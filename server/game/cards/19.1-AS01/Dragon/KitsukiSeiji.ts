import { Elements } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import DrawCard = require('../../../drawcard');

const ELEMENT_KEY = 'kitsuki-seiji-water';

export default class KitsukiSeiji extends DrawCard {
    static id = 'kitsuki-seiji';

    public setupCardAbilities() {
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
                    event.recipients.some((recipient: any) => this.fateRecipientIsSeijisRing(recipient.ring))
            },
            effect: 'put the fate that would go on the {1} ring on {0} instead',
            effectArgs: () => [this.getCurrentElementSymbol(ELEMENT_KEY)],
            gameAction: AbilityDsl.actions.cancel((context) => {
                switch (context.event.name) {
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

    public getPrintedElementSymbols() {
        const symbols = super.getPrintedElementSymbols();
        symbols.push({
            key: ELEMENT_KEY,
            prettyName: 'Ring',
            element: Elements.Water
        });
        return symbols;
    }

    private fateRecipientIsSeijisRing(recipient: any) {
        return (
            recipient && recipient.type === 'ring' && recipient.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY))
        );
    }

    private replacementForMoveFate(context: TriggeredAbilityContext) {
        return AbilityDsl.actions.placeFate({
            origin: context.event.origin,
            target: context.source,
            amount: context.event.fate
        });
    }

    private replacementForPlaceFateOnUnclaimedRings(context: TriggeredAbilityContext) {
        return AbilityDsl.actions.joint(
            context.event.recipients.map((recipient) => {
                const isSeijisRing = recipient.ring.hasElement(this.getCurrentElementSymbol(ELEMENT_KEY));
                if (isSeijisRing) {
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