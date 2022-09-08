describe('Demon Bear', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'shosuro-sadako'],
                    hand: ['discourage-pursuit'],
                    dynastyDiscard: ['demon-bear']
                },
                player2: {
                    inPlay: ['daidoji-uji', 'doji-challenger'],
                    dynastyDiscard: ['demon-bear']
                }
            });

            this.sadako = this.player1.findCardByName('shosuro-sadako');
            this.pursuit = this.player1.findCardByName('discourage-pursuit');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.bear1 = this.player1.findCardByName('demon-bear');
            this.bear = this.player2.findCardByName('demon-bear');
            this.player1.moveCard(this.bear1, 'province 1');
            this.player2.moveCard(this.bear, 'province 1');

            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('should be put into the conflict when a province you control is revealed during a military conflict', function () {
            this.p1.facedown = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });
            expect(this.bear.location).toBe('play area');
            expect(this.bear1.location).toBe('province 1');
            expect(this.getChatLogs(5)).toContain('player2 uses Demon Bear to put Demon Bear into play in the conflict');
        });

        it('should not be put into the conflict when a province you control is already revealed', function () {
            this.p1.facedown = false;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });
            expect(this.bear.location).toBe('province 1');
            expect(this.bear1.location).toBe('province 1');
        });

        it('should not be put into the conflict when a province you control is revealed during a pol conflict', function () {
            this.p1.facedown = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'political'
            });
            expect(this.bear.location).toBe('province 1');
            expect(this.bear1.location).toBe('province 1');
        });

        it('should not be put into the conflict from discard', function () {
            this.p1.facedown = true;
            this.player2.moveCard(this.bear, 'dynasty discard pile');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });
            expect(this.bear.location).toBe('dynasty discard pile');
            expect(this.bear1.location).toBe('province 1');
        });

        it('action ability - should target participating characters but not itself', function () {
            this.p1.facedown = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.challenger],
                province: this.p1,
                type: 'military'
            });

            this.player2.clickCard(this.bear);
            expect(this.player2).toBeAbleToSelect(this.diplomat);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.sadako);
            expect(this.player2).not.toBeAbleToSelect(this.uji);
            expect(this.player2).not.toBeAbleToSelect(this.bear);
        });

        it('action ability - should let both players trigger to give someone -2 mil', function () {
            this.p1.facedown = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.sadako],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });
            let fate1 = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player2.clickCard(this.bear);
            this.player2.clickCard(this.sadako);
            expect(this.player2.fate).toBe(fate2 - 1);
            expect(this.sadako.isDishonored).toBe(true);
            expect(this.sadako.getMilitarySkill()).toBe(2);

            this.player1.clickCard(this.bear);
            this.player1.clickCard(this.challenger);
            expect(this.player1.fate).toBe(fate1 - 1);
            expect(this.player2.fate).toBe(fate2 - 1);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(1);

            expect(this.getChatLogs(10)).toContain('player2 uses Demon Bear, spending 1 fate to maul Shosuro Sadako, dishonoring and giving Shosuro Sadako -2military');
            expect(this.getChatLogs(10)).toContain('player1 uses Demon Bear, spending 1 fate to maul Doji Challenger, giving Doji Challenger -2military');
        });

        it('action ability - should not dishonor if brought to zero after trigger', function () {
            this.p1.facedown = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.sadako],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });

            this.player2.clickCard(this.bear);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(1);
            this.player1.clickCard(this.pursuit);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.sadako);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(0);

            this.player2.clickCard(this.bear);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.challenger.getMilitarySkill()).toBe(0);
            expect(this.getChatLogs(10)).toContain('player2 uses Demon Bear, spending 1 fate to maul Doji Challenger, dishonoring and giving Doji Challenger -2military');
        });
    });
});
