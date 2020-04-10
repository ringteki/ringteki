const _ = require('underscore');
const { Locations, DuelTypes } = require('./Constants');

class Duel {
    constructor(game, challenger, target, type, statistic) {
        this.game = game;
        this.type = type;
        this.source = game.getFrameworkContext().source;
        this.challenger = challenger;
        this.target = target;
        this.bidFinished = false;
        this.winnner = null;
        this.loser = null;
        this.statistic = statistic;
        this.previousDuel = null;
    }

    getSkillStatistic(card) {
        if(this.statistic) {
            return this.statistic(card);
        }
        switch(this.type) {
            case DuelTypes.Military:
                return card.getMilitarySkill();
            case DuelTypes.Political:
                return card.getPoliticalSkill();
            case DuelTypes.Glory:
                return card.glory;
        }
    }

    isInvolved(card) {
        return (card === this.challenger || card === this.target || this.target.includes(card)) && card.location === Locations.PlayArea;
    }

    isInvolvedInAnyDuel(card) {
        return this.isInvolved(card) || this.previousDuel && this.previousDuel.isInvolvedInAnyDuel(card);
    }

    getTotalsForDisplay() {
        let [challengerTotal, targetTotal] = this.getTotals(this.getChallengerStatisticTotal(), this.getTargetStatisticTotal());
        return this.challenger.name + ': ' + challengerTotal.toString() + ' vs ' + targetTotal.toString() + ': ' + this.getTargetName();
    }

    getTotals(challengerTotal, targetTotal) {
        if(this.game.skirmish) {
            if(challengerTotal > targetTotal) {
                challengerTotal = 1;
                targetTotal = 0;
            } else if(challengerTotal < targetTotal) {
                challengerTotal = 0;
                targetTotal = 1;
            } else {
                challengerTotal = 0;
                targetTotal = 0;
            }
        }
        if(this.bidFinished) {
            challengerTotal += this.challenger.controller.honorBid;
            if(Array.isArray(this.target) && this.target.length) {
                targetTotal += this.target[0].controller.honorBid;
            } else {
                targetTotal += this.target.controller.honorBid;
            }
        }
        return [challengerTotal, targetTotal];
    }

    getChallengerStatisticTotal() {
        if(this.challenger.location !== Locations.PlayArea) {
            return '-';
        }
        return this.getSkillStatistic(this.challenger);
    }

    getTargetStatisticTotal() {
        if(this.target.every(card => card.location !== Locations.PlayArea)) {
            return '-';
        }
        return this.target.reduce((sum, card) => sum + this.getSkillStatistic(card), 0);
    }

    getTargetName() {
        return this.target.map((card) => card.name).join(' and ');
    }

    modifyDuelingSkill() {
        this.bidFinished = true;
    }

    determineResult() {
        let challengerTotal = this.getChallengerStatisticTotal();
        let targetTotal = this.getTargetStatisticTotal();
        if(challengerTotal === '-') {
            if(targetTotal !== '-' && targetTotal > 0) {
                // Challenger dead, target alive
                this.winner = this.target;
            }
            // Both dead
        } else if(targetTotal === '-') {
            // Challenger alive, target dead
            if(challengerTotal > 0) {
                this.winner = this.challenger;
            }
        } else {
            [challengerTotal, targetTotal] = this.getTotals(challengerTotal, targetTotal);

            if(challengerTotal > targetTotal) {
                // Both alive, challenger wins
                this.winner = this.challenger;
                this.loser = this.target;
            } else if(challengerTotal < targetTotal) {
                // Both alive, target wins
                this.winner = this.target;
                this.loser = this.challenger;
            }
        }
        if(Array.isArray(this.loser)) {
            this.loser = _.reject(this.loser, (card) => !card.checkRestrictions('loseDuels', card.game.getFrameworkContext()));
            if(this.loser.length === 0) {
                this.loser = null;
            } else if(this.loser.length === 1) {
                this.loser = this.loser[0];
            }
        } else {
            if(this.loser && !this.loser.checkRestrictions('loseDuels', this.loser.game.getFrameworkContext())) {
                this.loser = null;
            }
        }
        if(Array.isArray(this.winner)) {
            if(this.winner.length === 0) {
                this.winner = null;
            } else if(this.winner.length === 1) {
                this.winner = this.winner[0];
            }
        }
    }
}

module.exports = Duel;
