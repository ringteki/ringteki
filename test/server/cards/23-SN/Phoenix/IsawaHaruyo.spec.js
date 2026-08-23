describe('Isawa Haruyo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-haruyo'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                },
                player2: {
                    inPlay: ['isawa-haruyo'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                },
            });

            this.haruyo1 = this.player1.findCardByName('isawa-haruyo');
            this.haruyo2 = this.player2.findCardByName('isawa-haruyo');
        });

        it('while defending should prompt to choose a card to discard from that number of randomly chosen cards in your opponent\'s hand', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.haruyo1],
                defenders: [this.haruyo2]
            });
            this.player2.clickCard(this.haruyo2);
            expect(this.player2).toHavePrompt('Select a card:');
            let matchingButtons = this.player2.currentPrompt().buttons.filter(button =>
                ['Ornate Fan', 'Fine Katana', 'Banzai!', 'Let Go'].includes(button.text)
            );
            expect(matchingButtons.length).toBe(3);
            expect(this.player2.currentPrompt().buttons.length).toBe(3);
            let conflictDiscardPileSize = this.player1.player.conflictDiscardPile.length;
            let hand = this.player1.player.hand.length;
            this.player2.clickPrompt(matchingButtons[0].text);
            expect(this.player1.player.conflictDiscardPile.length).toBe(conflictDiscardPileSize + 1);
            expect(this.player1.player.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Isawa Haruyo to look at an amount of random cards in player1\'s hand equal to the strength of an attacked province and discard one of them');
            expect(this.getChatLogs(5)).toContain('player2 chooses ' + matchingButtons[0].text + ' to be discarded');
            expect(this.getChatLogs(5)).toContain('Isawa Haruyo sees ' + matchingButtons[0].text + ', ' + matchingButtons[1].text + ' and ' + matchingButtons[2].text);

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.haruyo1);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});

