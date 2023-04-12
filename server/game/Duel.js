const _ = require('underscore');
const { GameModes } = require('../GameModes');
const { Locations, DuelTypes, EffectNames } = require('./Constants');

const DuelParticipants = Object.freeze({
    Challenger: 'challenger',
    Target: 'target'
});

class Duel {
    constructor(game, challenger, target, type, statistic, challengingPlayer = challenger.controller) {
        this.game = game;
        this.type = type;
        this.source = game.getFrameworkContext().source;
        this.challenger = challenger;
        this.target = target;
        this.bidFinished = false;
        this.winnner = null;
        this.loser = null;
        this.winningPlayer = null;
        this.losingPlayer = null;
        this.statistic = statistic;
        this.previousDuel = null;
        this.challengingPlayer = challengingPlayer;
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
        if(this.game.gameMode === GameModes.Skirmish) {
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
            challengerTotal += this.challengingPlayer.honorBid;
            if(Array.isArray(this.target) && this.target.length) {
                targetTotal += this.challengingPlayer.opponent.honorBid;
            } else {
                targetTotal += this.challengingPlayer.opponent.honorBid;
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

    setWinner(winner) {
        if(winner === DuelParticipants.Challenger) {
            this.winner = this.challenger;
            this.winningPlayer = this.challengingPlayer;
        } else {
            this.winner = this.target;
            this.winningPlayer = this.challengingPlayer.opponent;
        }
    }

    setLoser(loser) {
        if(loser === DuelParticipants.Challenger) {
            this.loser = this.challenger;
            this.losingPlayer = this.challengingPlayer;
        } else {
            this.loser = this.target;
            this.losingPlayer = this.challengingPlayer.opponent;
        }
    }

    determineResult() {
        let challengerTotal = this.getChallengerStatisticTotal();
        let targetTotal = this.getTargetStatisticTotal();
        let challengerWins = this.challenger.mostRecentEffect(EffectNames.WinDuel) === this;

        if(challengerWins) {
            this.setWinner(DuelParticipants.Challenger);
            this.setLoser(DuelParticipants.Target);
        } else {
            if(challengerTotal === '-') {
                if(targetTotal !== '-' && targetTotal > 0) {
                    // Challenger dead, target alive
                    this.setWinner(DuelParticipants.Target);
                }
                // Both dead
            } else if(targetTotal === '-') {
                // Challenger alive, target dead
                if(challengerTotal > 0) {
                    this.setWinner(DuelParticipants.Challenger);
                }
            } else {
                [challengerTotal, targetTotal] = this.getTotals(challengerTotal, targetTotal);

                if(challengerTotal > targetTotal) {
                    // Both alive, challenger wins
                    this.setWinner(DuelParticipants.Challenger);
                    this.setLoser(DuelParticipants.Target);
                } else if(challengerTotal < targetTotal) {
                    // Both alive, target wins
                    this.setWinner(DuelParticipants.Target);
                    this.setLoser(DuelParticipants.Challenger);
                }
            }
        }
        if(Array.isArray(this.loser)) {
            this.loser = _.reject(this.loser, (card) => !card.checkRestrictions('loseDuels', card.game.getFrameworkContext()));
            if(this.loser.length === 0) {
                this.loser = null;
                this.losingPlayer = null;
            } else if(this.loser.length === 1) {
                this.loser = this.loser[0];
            }
        } else {
            if(this.loser && !this.loser.checkRestrictions('loseDuels', this.loser.game.getFrameworkContext())) {
                this.loser = null;
                this.losingPlayer = null;
            }
        }
        if(Array.isArray(this.winner)) {
            if(this.winner.length === 0) {
                this.winner = null;
                this.winningPlayer = null;
            } else if(this.winner.length === 1) {
                this.winner = this.winner[0];
            }
        }
    }
}

module.exports = Duel;
