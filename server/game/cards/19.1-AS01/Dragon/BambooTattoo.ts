import { Locations, Players, CardTypes } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');

export default class BambooTattoo extends DrawCard {
    static id = 'bamboo-tattoo';

    public setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'monk' });

        this.whileAttached({ effect: AbilityDsl.effects.addTrait('tattooed') });

        this.persistentEffect({
            location: Locations.Any,
            targetController: Players.Any,
            effect: AbilityDsl.effects.reduceCost({
                amount: 1,
                targetCondition: (target: BaseCard) =>
                    target instanceof DrawCard && target.type === CardTypes.Character && target.printedCost <= 3,
                match: (card: BaseCard, source: any) => card === source
            })
        });

        this.reaction({
            title: 'Ready attached character',
            when: {
                onCardBowed: (event, context) =>
                    context.source.parent &&
                    event.card === context.source.parent &&
                    event.context.source.type !== 'ring' &&
                    event.context.source.name !== 'Framework effect'
            },
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.ready((context) => ({ target: context.source.parent })),
                AbilityDsl.actions.conditional({
                    condition: (context) => this.isSelfTrigger(context),
                    trueGameAction: AbilityDsl.actions.dishonor((context) => ({ target: context.source.parent })),
                    falseGameAction: AbilityDsl.actions.noAction()
                })
            ]),
            effect: 'ready{1} {2}',
            effectArgs: (context: TriggeredAbilityContext) => [
                this.isSelfTrigger(context) ? ' and dishonor' : '',
                context.source.parent
            ]
        });
    }

    private isSelfTrigger(context) {
        return (
            context.source.controller &&
            context.event.context.player &&
            context.source.controller === context.event.context.player
        );
    }
}
