describe('Natures Wrath', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'shosuro-sadako'],
                    hand: ['discourage-pursuit'],
                    dynastyDiscard: ['nature-s-wrath']
                },
                player2: {
                    inPlay: ['daidoji-uji', 'doji-challenger'],
                    dynastyDiscard: ['nature-s-wrath']
                }
            });

            this.sadako = this.player1.findCardByName('shosuro-sadako');
            this.pursuit = this.player1.findCardByName('discourage-pursuit');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.wrath1 = this.player1.findCardByName('nature-s-wrath');
            this.wrath = this.player2.findCardByName('nature-s-wrath');
            this.player1.moveCard(this.wrath1, 'province 1');
            this.player2.moveCard(this.wrath, 'province 1');

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
            expect(this.wrath.location).toBe('play area');
            expect(this.wrath1.location).toBe('province 1');
            expect(this.getChatLogs(5)).toContain('player2 uses Nature\'s Wrath to put Nature\'s Wrath into play in the conflict');
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
            expect(this.wrath.location).toBe('province 1');
            expect(this.wrath1.location).toBe('province 1');
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
            expect(this.wrath.location).toBe('province 1');
            expect(this.wrath1.location).toBe('province 1');
        });

        it('should not be put into the conflict from discard', function () {
            this.p1.facedown = true;
            this.player2.moveCard(this.wrath, 'dynasty discard pile');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji, this.challenger],
                province: this.p1,
                type: 'military'
            });
            expect(this.wrath.location).toBe('dynasty discard pile');
            expect(this.wrath1.location).toBe('province 1');
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

            this.player2.clickCard(this.wrath);
            expect(this.player2).toBeAbleToSelect(this.diplomat);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.sadako);
            expect(this.player2).not.toBeAbleToSelect(this.uji);
            expect(this.player2).not.toBeAbleToSelect(this.wrath);
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

            this.player2.clickCard(this.wrath);
            this.player2.clickCard(this.sadako);
            expect(this.player2.fate).toBe(fate2 - 1);
            expect(this.sadako.isDishonored).toBe(true);
            expect(this.sadako.getMilitarySkill()).toBe(2);

            this.player1.clickCard(this.wrath);
            this.player1.clickCard(this.challenger);
            expect(this.player1.fate).toBe(fate1 - 1);
            expect(this.player2.fate).toBe(fate2 - 1);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(1);

            expect(this.getChatLogs(10)).toContain('player2 uses Nature\'s Wrath, spending 1 fate to give Shosuro Sadako -2military and dishonor them');
            expect(this.getChatLogs(10)).toContain('player1 uses Nature\'s Wrath, spending 1 fate to give Doji Challenger -2military');
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

            this.player2.clickCard(this.wrath);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(1);
            this.player1.clickCard(this.pursuit);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.sadako);
            expect(this.challenger.isDishonored).toBe(false);
            expect(this.challenger.getMilitarySkill()).toBe(0);

            this.player2.clickCard(this.wrath);
            this.player2.clickCard(this.challenger);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.challenger.getMilitarySkill()).toBe(0);
            expect(this.getChatLogs(10)).toContain('player2 uses Nature\'s Wrath, spending 1 fate to give Doji Challenger -2military and dishonor them');
        });
    });
});
