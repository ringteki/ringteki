import { CardTypes, CharacterStatus, TargetModes } from '../../../Constants';
import { EventRegistrar } from '../../../EventRegistrar';
import type { GameAction } from '../../../GameActions/GameAction';
import { StatusToken } from '../../../StatusToken';
import AbilityDsl from '../../../abilitydsl';
import DrawCard from '../../../drawcard';

const ORIGINL_TOKEN = 'original';
const SELECTION = 'selection';

export default class AsakoKousuke extends DrawCard {
    static id = 'asako-kousuke';

    tokensChanged = new Set<StatusToken>();

    setupCardAbilities() {
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onConflictFinished']);

        this.action({
            title: 'Treat the status token on a character as if it was another status token',
            condition: (context) => context.game.isDuringConflict(),
            cannotTargetFirst: true,
            targets: {
                [ORIGINL_TOKEN]: {
                    mode: TargetModes.Token,
                    cardType: CardTypes.Character,
                    cardCondition: (card: DrawCard) => card.isParticipating()
                },
                [SELECTION]: {
                    dependsOn: ORIGINL_TOKEN,
                    mode: TargetModes.Select,
                    choices: (context) => {
                        const targetToken: StatusToken = context.tokens[ORIGINL_TOKEN][0];
                        const targetCard = targetToken.card;
                        if (!(targetCard instanceof DrawCard)) {
                            // should never happen
                            return {};
                        }

                        const choices = [] as Array<[string, GameAction]>;
                        if (!targetCard.isHonored) {
                            choices.push([
                                'Turn it into Honorable',
                                this.handlerToOverrideStatus(targetToken, CharacterStatus.Honored)
                            ]);
                        }

                        if (!targetCard.isDishonored) {
                            choices.push([
                                'Turn it into Dishonorable',
                                this.handlerToOverrideStatus(targetToken, CharacterStatus.Dishonored)
                            ]);
                        }

                        if (!targetCard.isTainted) {
                            choices.push([
                                'Turn it into Tainted',
                                this.handlerToOverrideStatus(targetToken, CharacterStatus.Tainted)
                            ]);
                        }

                        return Object.fromEntries(choices);
                    }
                }
            }
        });
    }

    public onConflictFinished() {
        for (const token of this.tokensChanged) {
            const targetCard = token.card;
            token.overrideStatus = undefined;
            if (targetCard) {
                targetCard.updateStatusTokenEffects();
            }
        }
        this.tokensChanged.clear();
    }

    handlerToOverrideStatus(token: StatusToken, newStatus: CharacterStatus) {
        return AbilityDsl.actions.handler({
            handler: (context) => {
                token.overrideStatus = newStatus;
                this.tokensChanged.add(token);
                token.card.updateStatusTokenEffects();
                context.game.addMessage(
                    "{0}'s wisdom and wit clarifies what it means to be {2}. For this conflict, {1} is treated as {2}",
                    context.source,
                    token.card,
                    newStatus
                );
            }
        });
    }
}
