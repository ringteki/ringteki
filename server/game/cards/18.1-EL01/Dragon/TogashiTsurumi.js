const DrawCard = require('../../../drawcard.js');
const AbilityDsl = require('../../../abilitydsl');
const EventRegistrar = require('../../../eventregistrar');
const { Locations, Players, PlayTypes, CardTypes } = require('../../../Constants');

class TogashiTsurumi extends DrawCard {
    setupCardAbilities() {
        this.triggeredThisRound = false;
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register(['onRoundEnded']);

        this.action({
            title: 'Place a card underneath self',
            cost: AbilityDsl.costs.payFate(),
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            effect: 'place a card from their hand beneath {1}{2}',
            effectArgs: context => [
                context.source,
                !this.triggeredThisRound ? ' and draw a card' : ''
            ],
            target: {
                activePromptTitle: 'Choose a card',
                location: Locations.Hand,
                controller: Players.Self,
                cardType: [CardTypes.Event, CardTypes.Attachment, CardTypes.Character],
                gameAction: AbilityDsl.actions.multiple([
                    AbilityDsl.actions.draw(context => ({
                        target: context.player,
                        amount: this.triggeredThisRound ? 0 : 1
                    })),
                    AbilityDsl.actions.handler({
                        handler: context => {
                            this.triggeredThisRound = true;
                            const card = context.target;
                            context.player.moveCard(card, this.uuid);
                            card.controller = context.source.controller;
                            card.facedown = false;
                            card.lastingEffect(() => ({
                                until: {
                                    onCardMoved: event => event.card === card && event.originalLocation === this.uuid
                                },
                                match: card,
                                effect: [
                                    AbilityDsl.effects.hideWhenFaceUp()
                                ]
                            }));
                        }
                    })
                ])
            }
        });

        this.persistentEffect({
            location: Locations.PlayArea,
            targetLocation: this.uuid,
            targetController: Players.Self,
            match: card => {
                return card.location === this.uuid && card.hasTrait('kiho');
            },
            effect: [
                AbilityDsl.effects.canPlayFromOutOfPlay(player => {
                    return player === this.controller;
                }, PlayTypes.PlayFromHand),
                AbilityDsl.effects.registerToPlayFromOutOfPlay()
            ]
        });

        this.persistentEffect({
            effect: AbilityDsl.effects.modifyBothSkills(card => this.getSkillBonus(card))
        });
    }

    getSkillBonus(card) {
        return card.game.allCards.filter(card => card.controller === this.controller && card.location === this.uuid).length;
    }

    onRoundEnded() {
        this.triggeredThisRound = false;
    }
}

TogashiTsurumi.id = 'togashi-tsurumi';

module.exports = TogashiTsurumi;
