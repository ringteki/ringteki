describe('Skirmish Fate Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                },
                skirmish: true
            });

            this.player1.claimRing('air');
            this.player2.claimRing('earth');

            this.game.rings.fire.fate = 1;

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
        });

        it('should not add fate to rings', function() {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.game.rings.air.fate).toBe(0);
            expect(this.game.rings.earth.fate).toBe(0);
            expect(this.game.rings.fire.fate).toBe(1);
            expect(this.game.rings.void.fate).toBe(0);
            expect(this.game.rings.water.fate).toBe(0);
        });

        describe('Discard should be optional even on broken provinces', () => {
            beforeEach(function() {
                this.player1.player.promptedActionWindows.fate = true;
                this.player2.player.promptedActionWindows.fate = true;

                this.province1 = this.player1.findCardByName('skirmish-province-1', 'province 2');
                this.province2 = this.player2.findCardByName('skirmish-province-1', 'province 2');
                this.adept1 = this.player1.findCardByName('adept-of-the-waves', 'province 1');
                this.adept2 = this.player2.findCardByName('adept-of-the-waves', 'province 1');

                this.adept3 = this.player1.findCardByName('adept-of-the-waves', 'province 2');
                this.adept4 = this.player2.findCardByName('adept-of-the-waves', 'province 2');

                this.adept5 = this.player1.findCardByName('adept-of-the-waves', 'province 3');
                this.adept6 = this.player2.findCardByName('adept-of-the-waves', 'province 3');

                //4.2
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.province1.isBroken = true;
                this.province2.isBroken = true;

                this.adept1.facedown = false;
                this.adept2.facedown = false;
                this.adept3.facedown = false;
                this.adept4.facedown = false;
                this.adept5.facedown = true;
                this.adept6.facedown = true;

                //4.4 action window
                this.player1.pass();
                this.player2.pass();
            });

            it('should allow you to select faceup cards in any province and discard them', function() {
                expect(this.player1).toBeAbleToSelect(this.adept1);
                expect(this.player1).toBeAbleToSelect(this.adept3);
                expect(this.player1).not.toBeAbleToSelect(this.adept5);
                this.player1.clickCard(this.adept1);
                this.player1.clickPrompt('Done');
                expect(this.adept1.location).toBe('dynasty discard pile');

                expect(this.player2).toBeAbleToSelect(this.adept2);
                expect(this.player2).toBeAbleToSelect(this.adept4);
                expect(this.player2).not.toBeAbleToSelect(this.adept6);
                this.player2.clickCard(this.adept2);
                this.player2.clickPrompt('Done');
                expect(this.adept2.location).toBe('dynasty discard pile');
            });

            it('should not automatically discard faceup cards in broken provinces', function() {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                expect(this.adept3.location).not.toBe('dynasty discard pile');
                expect(this.adept4.location).not.toBe('dynasty discard pile');
            });
        });
    });
});
