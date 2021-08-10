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

        it('should make you discard a card to draw a card', function() {
            let hand = this.player1.hand.length;
            let conflictDeck = this.player1.conflictDeck.length;

            this.player1.clickCard(this.otter);
            let charge = this.player1.clickCard('charge', 'hand');
            expect(this.player1.hand.length).toBe(hand);
            expect(charge.location).toBe('conflict discard pile');

            expect(this.getChatLogs(5)).toContain('player1 uses Otter Yakatabune, discarding Charge! to draw 1 card');

            expect(this.player1.hand.length).toBe(hand);
            expect(this.player1.conflictDeck.length).toBe(conflictDeck - 1);
        });
    });
});
