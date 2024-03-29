const _ = require('underscore');
const { UiPrompt } = require('../UiPrompt.js');
const { CardTypes, EffectNames, EventNames } = require('../../Constants');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class SelectDefendersPrompt extends UiPrompt {
    constructor(game, player, conflict) {
        super(game);

        this.player = player;
        this.conflict = conflict;
        let mustBeDeclared = this.player.cardsInPlay.filter(card =>
            card.getEffects(EffectNames.MustBeDeclaredAsDefender).some(effect => effect === 'both' || effect === conflict.conflictType));
        for(const card of mustBeDeclared) {
            if(this.checkCardCondition(card) && !this.conflict.defenders.includes(card)) {
                this.selectCard(card);
            }
        }
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        let promptTitle = (capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' Conflict: '
            + this.conflict.attackerSkill + ' vs ' + this.conflict.defenderSkill);

        if(!this.conflict.conflictType || !this.conflict.element) {
            promptTitle = 'Declaring defenders before attackers';
        }
        return {
            menuTitle: 'Choose defenders',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to choose defenders' };
    }

    onCardClicked(player, card) {
        if(player !== this.player) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        return this.selectCard(card);
    }

    checkCardCondition(card) {
        if(this.conflict.defenders.includes(card) && card.getEffects(EffectNames.MustBeDeclaredAsDefender).some(effect => effect === 'both' || effect === this.conflict.conflictType)) {
            return false;
        }
        return (
            card.getType() === CardTypes.Character &&
            card.controller === this.player &&
            card.canDeclareAsDefender(this.conflict.conflictType)
        );
    }

    selectCard(card) {
        if(this.conflict.maxAllowedDefenders > -1 && this.conflict.defenders.length >= this.conflict.maxAllowedDefenders && !_.contains(this.conflict.defenders, card)) {
            return false;
        }

        if(!this.conflict.defenders.includes(card)) {
            this.conflict.addDefender(card);
        } else {
            this.conflict.removeFromConflict(card);
        }

        this.conflict.calculateSkill(true);

        return true;
    }

    menuCommand() {
        _.each(this.conflict.defenders, card => card.covert = false);
        this.conflict.setDefendersChosen(true);
        this.complete();
        this.game.raiseEvent(EventNames.OnDefendersDeclared, { conflict: this.conflict, defenders: this.conflict.defenders.slice() });
        return true;
    }
}

module.exports = SelectDefendersPrompt;
