const ActionWindow = require('../actionwindow.js');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class ConflictActionWindow extends ActionWindow {
    constructor(game, title, conflict) {
        super(game, title, 'conflict');
        this.conflict = conflict;
        this.displayTotals = false;
    }

    continue() {
        let completed = super.continue();
        if(!completed && this.displayTotals) {
            //this.conflict.calculateSkill();
            let conflictText = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' conflict';
            this.game.addMessage('{0} - Attacker: {1} Defender: {2}', conflictText, this.conflict.attackerSkill, this.conflict.defenderSkill);
            let winnerText = 'Attacker is winning the conflict';
            let breakingProvinces = [];
            if(this.conflict.attackerSkill === 0 && this.conflict.defenderSkill === 0) {
                winnerText = 'No-one is winning the conflict';
            } else if(this.conflict.defenderSkill > this.conflict.attackerSkill) {
                winnerText = 'Defender is winning the conflict';
            } else {
                const provinces = this.conflict.getConflictProvinces();
                provinces.forEach(province => {
                    if(province && !province.isBroken && province.allowGameAction('break') && this.conflict.attackerSkill >= this.conflict.defenderSkill + province.getStrength()) {
                        breakingProvinces.push(province);
                    }
                });
                if(breakingProvinces.length === 1) {
                    winnerText = winnerText + ' - {0} is breaking!';
                } else if(breakingProvinces.length > 1) {
                    winnerText = winnerText + ' - {0} are breaking!';
                }
            }
            this.game.addMessage(winnerText, breakingProvinces);
            this.displayTotals = false;
        }
        return completed;
    }

    activePrompt() {
        let props = super.activePrompt();

        //this.conflict.calculateSkill();
        let conflictText = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.element] + ' conflict';
        let skillText = 'Attacker: ' + this.conflict.attackerSkill + ' Defender: ' + this.conflict.defenderSkill;
        return {
            menuTitle: [conflictText, skillText].join('\n'),
            buttons: props.buttons,
            promptTitle: this.title
        };
    }

    postResolutionUpdate(resolver) {
        super.postResolutionUpdate(resolver);
        if(!this.game.manualMode) {
            this.displayTotals = true;
        }
    }
}

module.exports = ConflictActionWindow;
