describe('Loyal Attendant', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                },
                player2: {
                    inPlay: ['loyal-attendant'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'let-go']
                },
            });

            this.tadaka = this.player1.findCardByName('isawa-tadaka');
            this.attendant = this.player2.findCardByName('loyal-attendant');

            this.fan1 = this.player1.findCardByName('ornate-fan');
            this.katana1 = this.player1.findCardByName('fine-katana');
            this.fan2 = this.player2.findCardByName('ornate-fan');
            this.katana2 = this.player2.findCardByName('fine-katana');

            this.player1.playAttachment(this.fan1, this.tadaka);
            this.player2.playAttachment(this.fan2, this.attendant);
        });

        it('happy path', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tadaka],
                defenders: [this.attendant]
            });

            // shouldn't work yet, no valid target
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.attendant);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.playAttachment(this.katana2, this.tadaka);
            this.player1.pass();

            this.player2.clickCard(this.attendant);
            expect(this.player2).toBeAbleToSelect(this.tadaka);
            this.player2.clickCard(this.tadaka);
            expect(this.player2).toHavePrompt('Select a card:');
            let matchingButtons = this.player2.currentPrompt().buttons.filter(button =>
                ['Fine Katana', 'Banzai!', 'Let Go'].includes(button.text)
            );
            expect(matchingButtons.length).toBe(2);
            expect(this.player2.currentPrompt().buttons.length).toBe(2);

            let conflictDiscardPileSize = this.player1.player.conflictDiscardPile.length;
            let hand = this.player1.player.hand.length;
            this.player2.clickPrompt(matchingButtons[0].text);
            expect(this.player1.player.conflictDiscardPile.length).toBe(conflictDiscardPileSize + 1);
            expect(this.player1.player.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Loyal Attendant to look at 2 random cards in player1\'s hand and discard one of them');
            expect(this.getChatLogs(5)).toContain('player2 chooses ' + matchingButtons[0].text + ' to be discarded');
            expect(this.getChatLogs(5)).toContain('Loyal Attendant sees ' + matchingButtons[0].text + ' and ' + matchingButtons[1].text);
        });
    });
});

