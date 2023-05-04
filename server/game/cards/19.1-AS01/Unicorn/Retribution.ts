import { GameModes } from '../../../../GameModes';
import { CardTypes, Players, Durations, ConflictTypes, Locations } from '../../../Constants';
import TriggeredAbilityContext = require('../../../TriggeredAbilityContext');
import AbilityDsl = require('../../../abilitydsl');
import BaseCard = require('../../../basecard');
import DrawCard = require('../../../drawcard');
import Player = require('../../../player');

export default class Retribution extends DrawCard {
    static id = 'retribution-';

    public setupCardAbilities() {
        this.reaction({
            title: 'Immediately declare a military conflict',
            when: {
                onConflictFinished: (event, context) => this.triggerCondition(event, context)
            },
            effect: 'declare a military conflict, attacking with {1}',
            effectArgs: (context: TriggeredAbilityContext) => [context.target],
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                cardCondition: (card, context) => this.characterCanBeAttacker(card, context),
                gameAction: AbilityDsl.actions.sequentialContext((context) => ({
                    gameActions: [
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfConflict,
                            effect: AbilityDsl.effects.mustBeDeclaredAsAttacker(),
                            target: context.target
                        }),
                        AbilityDsl.actions.cardLastingEffect({
                            duration: Durations.UntilEndOfConflict,
                            effect: AbilityDsl.effects.cardCannot('declareAsAttacker'),
                            target: (context.player.cardsInPlay as BaseCard[]).filter(
                                (card) => card.getType() === CardTypes.Character && card !== context.target
                            )
                        }),
                        AbilityDsl.actions.playerLastingEffect({
                            targetController: context.player,
                            duration: Durations.UntilEndOfPhase,
                            effect: AbilityDsl.effects.additionalConflict('military')
                        }),
                        AbilityDsl.actions.initiateConflict({
                            target: context.player,
                            canPass: false,
                            forcedDeclaredType: ConflictTypes.Military
                        })
                    ]
                }))
            },
            max: AbilityDsl.limit.perRound(1)
        });
    }

    private triggerCondition(event: any, context: TriggeredAbilityContext) {
        return (
            // Lost conflict as defender
            event.conflict.attackingPlayer === context.player.opponent &&
            event.conflict.winner === context.player.opponent &&
            // Equal or more broken provinces
            this.brokenProvinceCountForPlayer(context.player) >=
                this.brokenProvinceCountForPlayer(context.player.opponent)
        );
    }

    private characterCanBeAttacker(card: BaseCard, context: TriggeredAbilityContext) {
        return (
            // honored or battlemaiden
            (card.isHonored || card.hasTrait('battle-maiden')) &&
            // can attack military
            Object.values(this.game.rings).some(
                (ring) => ring.canDeclare(context.player) && card.canDeclareAsAttacker(ConflictTypes.Military, ring)
            )
        );
    }

    private brokenProvinceCountForPlayer(player: Player) {
        const gameModeProvinceCount = this.game.gameMode === GameModes.Skirmish ? 4 : 5;
        const locations = [
            Locations.StrongholdProvince,
            Locations.ProvinceOne,
            Locations.ProvinceTwo,
            Locations.ProvinceThree,
            Locations.ProvinceFour
        ].slice(0, gameModeProvinceCount);
        return locations.reduce(
            (sum, location) => (player.getProvinceCardInProvince(location).isBroken ? sum + 1 : sum),
            0
        );
    }
}
