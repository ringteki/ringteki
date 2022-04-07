const DrawCard = require('../../../drawcard.js');
const { AbilityTypes, CardTypes, Locations, Players, Durations, PlayTypes, TargetModes } = require('../../../Constants');
const AbilityDsl = require('../../../abilitydsl');
const CardAbility = require('../../../CardAbility');
const PlayDynastyAsConflictCharacterAction = require('../../../playdynastycharacterasconflictaction');

class FieldBarracks extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Attach to province',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            effect: 'attach {1} to {2}',
            effectArgs: context => {
                let province = context.player.getProvinceCardInProvince(context.source.location);
                return [context.source, province.facedown ? province.location : province];
            },
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cardLastingEffect(context => ({
                    canChangeZoneOnce: true,
                    duration: Durations.Custom,
                    target: context.source,
                    effect: [
                        AbilityDsl.effects.changeType(CardTypes.Attachment),
                        AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                            title: 'Play a character or discard a card',
                            effect: 'play or discard {0}',
                            condition: context => context.source.parent,
                            target: {
                                cardType: [CardTypes.Character, CardTypes.Event, CardTypes.Holding],
                                location: Locations.Provinces,
                                controller: Players.Self,
                                cardCondition: (card, context) => card.isFaceup() && card.location === context.source.parent.location,
                                gameAction: AbilityDsl.actions.chooseAction({
                                    messages: {
                                        'Discard and refill faceup': '{0} chooses to discard {1} and refill the province faceup',
                                        'Play this card': '{0} chooses to play {1}'
                                    },
                                    choices: {
                                        'Discard and refill faceup': AbilityDsl.actions.multiple([
                                            AbilityDsl.actions.moveCard({ destination: Locations.DynastyDiscardPile }),
                                            AbilityDsl.actions.refillFaceup(context => ({
                                                target: context.player,
                                                location: context.source.parent.location
                                            }))
                                        ]),
                                        'Play this card': AbilityDsl.actions.playCard({
                                            source: this,
                                            playType: PlayTypes.PlayFromHand,
                                            ignoredRequirements: ['phase'],
                                            playAction: context.target ? new PlayDynastyAsConflictCharacterAction(context.target, false) : undefined
                                        })
                                    }
                                })
                            },
                            then: context => {
                                if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('commander'))) {
                                    return;
                                }
                                if(context.subResolution) {
                                    return true;
                                }
                                return {
                                    target: {
                                        mode: TargetModes.Select,
                                        choices: {
                                            'Resolve this ability again': AbilityDsl.actions.handler({
                                                handler: () => {}
                                            }),
                                            'Done': () => true
                                        }
                                    },
                                    message: '{0} chooses {3}to resolve {1} again',
                                    messageArgs: context => [context.select === 'Done' ? 'not ' : ''],
                                    then: {
                                        gameAction: AbilityDsl.actions.resolveAbility({
                                            ability: context.ability instanceof CardAbility ? context.ability : null,
                                            subResolution: true,
                                            choosingPlayerOverride: context.choosingPlayerOverride
                                        })
                                    }
                                };
                            }
                        })
                    ]
                })),
                AbilityDsl.actions.attach(context => ({
                    attachment: context.source,
                    target: context.player.getProvinceCardInProvince(context.source.location)
                }))
            ])
        });
    }

    canAttach(parent) {
        return parent && parent.getType() === CardTypes.Province && this.getType() === CardTypes.Attachment;
    }
}

FieldBarracks.id = 'field-barracks';

module.exports = FieldBarracks;
