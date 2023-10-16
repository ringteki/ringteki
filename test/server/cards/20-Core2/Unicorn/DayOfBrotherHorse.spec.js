describe('Day of Brother Horse', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['day-of-brother-horse'],
                    inPlay: ['adept-of-the-waves', 'solemn-scholar', 'miya-mystic']
                },
                player2: {
                    inPlay: []
                }
            });

            this.dayofBrotherHorse = this.player1.findCardByName('day-of-brother-horse');
            this.adept = this.player1.findCardByName('adept-of-the-waves');
            this.solemn = this.player1.findCardByName('solemn-scholar');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.adept.bow();
            this.solemn.bow();
        });

        it('triggers when you pass a conflict', function () {
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dayofBrotherHorse);
        });

        it('does not trigger if you have no ready characters', function () {
            this.mystic.bow();

            this.noMoreActions();
            this.player1.clickPrompt('Pass');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.dayofBrotherHorse);
        });

        it('if triggered, draw 3 cards', function () {
            const initialHandSize = this.player1.hand.length;
            this.noMoreActions();
            this.player1.clickPrompt('Pass Conflict');
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.dayofBrotherHorse);
            expect(this.player1.hand.length).toBe(initialHandSize - 1 + 3);
            expect(this.getChatLogs(5)).toContain(
                'player1 plays Day of Brother Horse to draw 3 cards - they take a break to celebrate their prized steeds'
            );
        });
    });
});
