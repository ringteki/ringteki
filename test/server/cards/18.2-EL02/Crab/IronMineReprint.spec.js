describe('Iron Mine Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['steadfast-witch-hunter', 'vanguard-warrior'],
                    dynastyDiscard: ['jade-mine']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['assassination']
                }
            });
            this.steadfastWitchHunter = this.player1.findCardByName('steadfast-witch-hunter');
            this.warrior = this.player1.findCardByName('vanguard-warrior');
            this.mine = this.player1.findCardByName('jade-mine');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.assassination = this.player2.findCardByName('assassination');

            this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player1.findCardByName('shameful-display', 'province 4');

            this.player1.placeCardInProvince(this.mine, 'province 3');
            this.mine.facedown = false;
            this.p3.isBroken = true;
        });

        it('should cost a fate to trigger', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.steadfastWitchHunter, this.warrior],
                defenders: [this.challenger],
                type: 'military'
            });

            let fate = this.player1.fate;

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mine);
            this.player1.clickCard(this.mine);
            expect(this.warrior.location).toBe('play area');
            expect(this.mine.location).toBe('dynasty discard pile');
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.getChatLogs(5)).toContain('player1 uses Jade Mine, spending 1 fate to prevent Vanguard Warrior from leaving play');
        });

        it('discard reaction - should not prompt owner', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.steadfastWitchHunter, this.warrior],
                defenders: [],
                type: 'military'
            });

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('discard reaction - should prompt opponent', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
                province: this.p1,
                type: 'military'
            });

            this.noMoreActions();
            this.player2.clickPrompt('No');

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.mine);
            this.player2.clickCard(this.mine);
            expect(this.mine.location).toBe('dynasty discard pile');

            this.player2.clickPrompt('Don\'t Resolve');
            expect(this.getChatLogs(5)).toContain('player2 uses Jade Mine to discard Jade Mine');
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
