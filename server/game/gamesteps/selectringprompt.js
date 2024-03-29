const _ = require('underscore');
const { AbilityContext } = require('../AbilityContext.js');
const EffectSource = require('../EffectSource.js');
const { UiPrompt } = require('./UiPrompt.js');

/**
 * General purpose prompt that asks the user to select a ring.
 *
 * The properties option object has the following properties:
 * additionalButtons  - array of additional buttons for the prompt.
 * activePromptTitle  - the title that should be used in the prompt for the
 *                      choosing player.
 * waitingPromptTitle - the title that should be used in the prompt for the
 *                      opponent players.
 * ringCondition      - a function that takes a ring and should return a boolean
 *                      on whether that ring is elligible to be selected.
 * onSelect           - a callback that is called as soon as an elligible ring
 *                      is clicked. If the callback does not return true, the
 *                      prompt is not marked as complete.
 * onMenuCommand      - a callback that is called when one of the additional
 *                      buttons is clicked.
 * onCancel           - a callback that is called when the player clicks the
 *                      done button without selecting any rings.
 * source             - what is at the origin of the user prompt, usually a card;
 *                      used to provide a default waitingPromptTitle, if missing
 */
class SelectRingPrompt extends UiPrompt {
    constructor(game, choosingPlayer, properties) {
        super(game);

        this.choosingPlayer = choosingPlayer;
        if(_.isString(properties.source)) {
            properties.source = new EffectSource(game, properties.source);
        } else if(properties.context && properties.context.source) {
            properties.source = properties.context.source;
        }
        if(properties.source && !properties.waitingPromptTitle) {
            properties.waitingPromptTitle = 'Waiting for opponent to use ' + properties.source.name;
        } else if(!properties.source) {
            properties.source = new EffectSource(game);
        }

        this.properties = properties;
        this.context = properties.context || new AbilityContext({ game: game, player: choosingPlayer, source: properties.source });
        _.defaults(this.properties, this.defaultProperties());
        this.selectedRing = null;
    }

    defaultProperties() {
        return {
            buttons: [],
            controls: this.getDefaultControls(),
            ringCondition: () => true,
            onSelect: () => true,
            onMenuCommand: () => true,
            onCancel: () => true,
            optional: false,
            hideIfNoLegalTargets: false
        };
    }

    getDefaultControls() {
        if(!this.properties.context) {
            return [];
        }
        let targets = this.properties.context.targets ? Object.values(this.properties.context.targets).map(target => target.getShortSummaryForControls(this.choosingPlayer)) : [];
        if(targets.length === 0 && this.properties.context.event && this.properties.context.event.card) {
            this.targets = [this.properties.context.event.card.getShortSummaryForControls(this.choosingPlayer)];
        }
        return [{
            type: 'targeting',
            source: this.properties.context.source.getShortSummary(),
            targets: targets
        }];
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    continue() {
        if(this.properties.hideIfNoLegalTargets && this.properties.optional && this.getSelectableRings().length === 0) {
            this.complete();
        }

        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    highlightSelectableRings() {
        this.choosingPlayer.setSelectableRings(this.getSelectableRings());
    }

    getSelectableRings() {
        let selectableRings = _.filter(this.game.rings, ring => {
            return this.properties.ringCondition(ring, this.context);
        });

        return selectableRings;
    }

    activePrompt() {
        let buttons = this.properties.buttons;
        if(this.properties.optional) {
            buttons.push({ text: 'Done', arg: 'done' });
        }
        if(this.game.manualMode && !_.any(buttons, button => button.arg === 'cancel')) {
            buttons.push({ text: 'Cancel Prompt', arg: 'cancel' });
        }
        return {
            source: this.properties.source,
            selectCard: true,
            selectRing: true,
            selectOrder: this.properties.ordered,
            menuTitle: this.properties.activePromptTitle || this.defaultActivePromptTitle(),
            buttons: this.properties.buttons,
            promptTitle: this.properties.source ? this.properties.source.name : undefined
        };
    }

    defaultActivePromptTitle() {
        return 'Choose a ring';
    }

    waitingPrompt() {
        return { menuTitle: this.properties.waitingPromptTitle || 'Waiting for opponent' };
    }

    onRingClicked(player, ring) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.properties.ringCondition(ring, this.context)) {
            return true;
        }

        if(this.properties.onSelect(player, ring)) {
            this.complete();
        }
    }

    menuCommand(player, arg) {
        if(arg === 'cancel') {
            this.properties.onCancel(player);
            this.complete();
            return true;
        } else if(this.properties.onMenuCommand(player, arg)) {
            this.complete();
            return true;
        }
        return false;
    }

    complete() {
        this.choosingPlayer.clearSelectableRings();
        return super.complete();
    }
}

module.exports = SelectRingPrompt;

