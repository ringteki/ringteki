describe('Protected Merchant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['protected-merchant', 'hidden-moon-dojo']
                }
            });

            this.merchant = this.player1.placeCardInProvince('protected-merchant', 'province 1');
            this.hiddenMoonDojo = this.player1.placeCardInProvince('hidden-moon-dojo', 'province 2');
        });

        it('should react to being played during the dynasty phase and put 1 fate on itself', function() {
            this.player1.clickCard(this.merchant);
            this.player1.clickPrompt('0');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.merchant);
            this.player1.clickCard(this.merchant);
            expect(this.merchant.fate).toBe(1);
        });

        it('should not react to being played during another phase', function() {
            this.noMoreActions();
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            // draw phase action window
            this.player1.clickCard(this.merchant);
            this.player1.clickPrompt('0');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.merchant.fate).toBe(0);
        });
    });
});
