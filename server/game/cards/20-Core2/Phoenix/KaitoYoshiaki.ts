import { CardTypes } from '../../../Constants';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

function isEvil(character: DrawCard): boolean {
    return character.isTainted || character.hasTrait('shadowlands');
}

export default class KaitoYoshiaki extends DrawCard {
    static id = 'kaito-yoshiaki';

    setupCardAbilities() {
        this.action({
            title: 'Punish the wicked',
            condition: (context) => context.source.isParticipating(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card) => !card.isUnique() && card.isParticipating(),
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.cardLastingEffect({
                        effect: [
                            AbilityDsl.effects.setBaseMilitarySkill(0),
                            AbilityDsl.effects.setBasePoliticalSkill(0)
                        ]
                    }),
                    AbilityDsl.actions.conditional({
                        condition: ({ target }: { target: DrawCard }) => isEvil(target),
                        trueGameAction: AbilityDsl.actions.removeFate(),
                        falseGameAction: AbilityDsl.actions.noAction()
                    })
                ])
            },
            effect: '{3}set the base skills of {0} to 0{1}/0{2}',
            effectArgs: (context) => ['military', 'political', isEvil(context.target) ? 'remove a fate from and ' : '']
        });
    }
}
