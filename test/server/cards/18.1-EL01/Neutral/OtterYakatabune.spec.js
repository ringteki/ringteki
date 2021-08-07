describe('Otter Yatabune', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    dynastyDiscard: ['otter-yakatabune'],
                    hand: ['oracle-of-stone', 'charge', 'spyglass']
                },
                player2: {
                    hand: ['mantra-of-fire', 'mantra-of-water']
                }
            });
            this.otter = this.player1.placeCardInProvince('otter-yakatabune', 'province 1');
            this.oracleOfStone = this.player1.findCardByName('oracle-of-stone');
        });

        it('should make you draw a card', function() {
            let hand = this.player1.hand.length;
            let conflictDeck = this.player1.conflictDeck.length;
            let hand2 = this.player2.hand.length;
            let conflictDeck2 = this.player2.conflictDeck.length;
            this.player1.clickCard(this.otter);

            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.player1.conflictDeck.length).toBe(conflictDeck - 1);
            expect(this.player2.hand.length).toBe(hand2);
            expect(this.player2.conflictDeck.length).toBe(conflictDeck2);
        });

        it('should make you discard a card', function() {
            this.player1.clickCard(this.otter);
            let hand1 = this.player1.hand.length;
            let charge = this.player1.clickCard('charge', 'hand');

            expect(this.player1.hand.length).toBe(hand1 - 1);
            expect(charge.location).toBe('conflict discard pile');

            expect(this.getChatLogs(5)).toContain('player1 uses Otter Yakatabune to draw and then discard a card');
            expect(this.getChatLogs(5)).toContain('player1 discards Charge!');
        });
    });
});
