describe('Skirmish Mode - Dynasty Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['way-of-the-crane', 'kirei-ko']
                },
                player2: {
                    inPlay: ['beloved-advisor']
                },
                skirmish: true
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.advisor = this.player2.findCardByName('beloved-advisor');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.kireiKo = this.player1.findCardByName('kirei-ko');
        });

        describe('Events', function() {
            it('should not allow playing dynasty action events', function() {
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.crane);
                expect(this.player1).toHavePrompt('Play cards from provinces');
            });

            it('should allow playing reacction/interrupt events', function() {
                this.player1.pass();
                this.player2.clickCard(this.advisor);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kireiKo);
                this.player1.clickCard(this.kireiKo);
                expect(this.advisor.bowed).toBe(true);
            });
        });

        describe('Passing Fate', function() {
            it('should not give passing fate', function() {
                let fate = this.player1.fate;
                this.player1.pass();
                expect(this.player1.fate).toBe(fate);
                expect(this.getChatLogs(3)).toContain('player1 passes');
                expect(this.getChatLogs(3)).not.toContain('player1 is the first to pass, and gains 1 fate');
            });
        });
    });
});

describe('Normal Mode - Dynasty Phase', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['way-of-the-crane', 'kirei-ko']
                },
                player2: {
                    inPlay: ['beloved-advisor']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.advisor = this.player2.findCardByName('beloved-advisor');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.kireiKo = this.player1.findCardByName('kirei-ko');
        });

        describe('Events', function() {
            it('should allow playing dynasty action events', function() {
                expect(this.player1).toHavePrompt('Play cards from provinces');
                this.player1.clickCard(this.crane);
                expect(this.player1).toHavePrompt('Way of the Crane');
            });
        });

        describe('Passing Fate', function() {
            it('should give passing fate', function() {
                let fate = this.player1.fate;
                this.player1.pass();
                expect(this.player1.fate).toBe(fate + 1);
                expect(this.getChatLogs(3)).toContain('player1 is the first to pass, and gains 1 fate');
            });
        });
    });
});
