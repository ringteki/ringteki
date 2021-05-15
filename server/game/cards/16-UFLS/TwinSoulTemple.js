const StrongholdCard = require('../../strongholdcard.js');
const { Durations, Elements, TargetModes, Locations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class TwinSoulTemple extends StrongholdCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow this stronghold',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                activePromptTitle: 'Choose an element to replace',
                mode: TargetModes.ElementSymbol,
                location: [Locations.PlayArea, Locations.Provinces],
                gameAction: AbilityDsl.actions.menuPrompt(context => ({
                    activePromptTitle: 'Choose the new element',
                    choices: this.getChoices(context),
                    gameAction: AbilityDsl.actions.cardLastingEffect({
                        target: context.elementCard,
                        duration: Durations.UntilEndOfPhase
                    }),
                    choiceHandler: (choice, displayMessage) => {
                        let newElement = choice.toLowerCase();
                        if(displayMessage) {
                            this.game.addMessage('{0} replaces {1}\'s {2} ({3}) symbol with {4}', context.player, context.elementCard, context.element.prettyName, this.capitalize(context.element.element), this.capitalize(newElement));
                        }
                        return {
                            effect: AbilityDsl.effects.replacePrintedElement({
                                key: context.element.key,
                                element: newElement
                            })
                        };
                    }
                }))
            },
            effect: 'replace a printed element symbol with a different one'
        });
    }

    getChoices(context) {
        let els = [Elements.Air, Elements.Earth, Elements.Fire, Elements.Void, Elements.Water];
        let currentEl = context.element.element;

        const index = els.indexOf(currentEl);
        if(index > -1) {
            els.splice(index, 1);
        }
        els.forEach((e, i) => els[i] = this.capitalize(e));
        return els;
    }

    capitalize(string) {
        return string[0].toUpperCase() + string.substring(1);
    }
}

TwinSoulTemple.id = 'twin-soul-temple';

module.exports = TwinSoulTemple;
