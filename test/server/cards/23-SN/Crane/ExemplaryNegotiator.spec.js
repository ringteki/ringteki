describe('Exemplary Negotiator', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['exemplary-negotiator', 'doji-diplomat'],
                    hand: ['let-go', 'voice-of-honor', 'assassination']
                },
                player2: {
                    inPlay: ['moto-youth'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai']
                }
            });


            this.negotiator = this.player1.findCardByName('exemplary-negotiator');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.letgo = this.player1.findCardByName('let-go');
            this.voice = this.player1.findCardByName('voice-of-honor');
            this.assassination = this.player1.findCardByName('assassination');

            this.youth = this.player2.findCardByName('moto-youth');
        });

        it('Discard 2', function () {
            this.diplomat.dishonor();

            let hand = this.player2.hand.length;

            this.player1.clickCard(this.negotiator);
            expect(this.player1).toHavePrompt('Choose up to 2 cards to discard');
            expect(this.player1).toBeAbleToSelect(this.letgo);
            expect(this.player1).toBeAbleToSelect(this.voice);
            expect(this.player1).toBeAbleToSelect(this.assassination);

            this.player1.clickCard(this.letgo);
            this.player1.clickCard(this.voice);
            this.player1.clickPrompt('Done');

            expect(this.getChatLogs(10)).toContain('player1 uses Exemplary Negotiator to discard Let Go and Voice of Honor to make player2 discard 2 cards at random');
            expect(this.player2.hand.length).toBe(hand - 2);
        });

        it('Discard 1', function () {
            this.diplomat.dishonor();

            let hand = this.player2.hand.length;

            this.player1.clickCard(this.negotiator);
            expect(this.player1).toHavePrompt('Choose up to 2 cards to discard');
            this.player1.clickCard(this.letgo);
            this.player1.clickPrompt('Done');

            expect(this.getChatLogs(10)).toContain('player1 uses Exemplary Negotiator to discard Let Go to make player2 discard 1 card at random');
            expect(this.player2.hand.length).toBe(hand - 1);
        });

        it('Doesnt work with no dishonored characters you control', function () {
            this.youth.dishonor();
            this.player1.clickCard(this.negotiator);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
