const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');
const { Players, CardTypes, EventNames } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class HonoredVeterans extends DrawCard {
    setupCardAbilities() {
        this.charactersPlayedThisPhase = {};
        this.eventRegistrar = new EventRegistrar(this.game, this);
        this.eventRegistrar.register([EventNames.OnPhaseStarted, EventNames.OnCardPlayed]);

        this.action({
            title: 'Honor characters',
            condition: context => this.canBePlayed(context),
            targets: {
                myCharacter: {
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card, context.player),
                    gameAction: AbilityDsl.actions.honor()
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardTypes.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => card.hasTrait('bushi') && this.wasCharacterPlayedThisPhase(card, context.player.opponent),
                    gameAction: AbilityDsl.actions.honor()
                }
            },
            effect: 'honor {1}',
            effectArgs: context => [this.getCharacters(context)]
        });
    }

    getCharacters(context) {
        let characters = [];
        if(context.targets.myCharacter && !Array.isArray(context.targets.myCharacter)) {
            characters.push(context.targets.myCharacter);
        }
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            characters.push(context.targets.oppCharacter);
        }
        if(characters.length === 0) {
            characters.push('no one');
        }

        return characters;
    }

    wasCharacterPlayedThisPhase(card, player) {
        if(player && Object.prototype.hasOwnProperty.call(this.charactersPlayedThisPhase, player)) {
            return this.charactersPlayedThisPhase[player].includes(card);
        }
        return false;
    }

    canBePlayed(context) {
        return this.hasLegalTarget(context.player) || this.hasLegalTarget(context.player.opponent);
    }

    hasLegalTarget(player) {
        if(player && Object.prototype.hasOwnProperty.call(this.charactersPlayedThisPhase, player)) {
            return this.charactersPlayedThisPhase[player].some(card => card.hasTrait('bushi'));
        }
        return false;
    }

    onCardPlayed(event) {
        if(event.player && event.card.type === CardTypes.Character) {
            if(!Object.prototype.hasOwnProperty.call(this.charactersPlayedThisPhase, event.player)) {
                this.charactersPlayedThisPhase[event.player] = [];
            }
            this.charactersPlayedThisPhase[event.player].push(event.card);
        }
    }

    onPhaseStarted() {
        this.charactersPlayedThisPhase = {};
    }
}

HonoredVeterans.id = 'honored-veterans';

module.exports = HonoredVeterans;
