describe('Hida Marauder', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-marauder', 'adept-of-the-waves', 'solemn-scholar']
                },
                player2: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai']
                }
            });

            this.hida = this.player1.findCardByName('hida-marauder');
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
            this.solemnScholar = this.player1.findCardByName('solemn-scholar');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.kuwanan.honor();
        });

        it('should prompt to discard when character wins', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hida, this.adeptOfTheWaves],
                defenders: []
            });
            this.player2.pass();
            this.player1.pass();
            this.player1.clickCard(this.hida);
            expect(this.player1).toHavePrompt('Select a card:');
            let matchingButtons = this.player1.currentPrompt().buttons.filter(button =>
                ['Ornate Fan', 'Fine Katana', 'Banzai!'].includes(button.text)
            );
            expect(matchingButtons.length).toBe(2);
            expect(this.player1.currentPrompt().buttons.length).toBe(2);
            let conflictDiscardPileSize = this.player2.player.conflictDiscardPile.length;
            let hand = this.player2.player.hand.length;
            this.player1.clickPrompt(matchingButtons[0].text);
            expect(this.player2.player.conflictDiscardPile.length).toBe(conflictDiscardPileSize + 1);
            expect(this.player2.player.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(5)).toContain('player1 chooses ' + matchingButtons[0].text + ' to be discarded');
            expect(this.getChatLogs(5)).toContain('player2 reveals ' + matchingButtons[0].text + ' due to Hida Marauder');
            expect(this.getChatLogs(5)).toContain('player2 reveals ' + matchingButtons[1].text + ' due to Hida Marauder');
        });

        it('should not prompt when losing', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.hida, this.adeptOfTheWaves],
                defenders: [this.kuwanan]
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not prompt when another character wins', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves],
                defenders: []
            });
            this.player2.pass();
            this.player1.pass();
            expect(this.player1).toHavePrompt('Air Ring');
        });
    });
});
