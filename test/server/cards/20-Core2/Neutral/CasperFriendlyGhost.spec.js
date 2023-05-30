describe('Casper Friendly Ghost', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['casper-friendly-ghost']
                },
                player2: {
                    fate: 2
                }
            });
        });

        it('should allow it\'s controller to steal a fate', function () {
            this.casperFriendlyGhost = this.player1.playCharacterFromHand('casper-friendly-ghost');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.casperFriendlyGhost);
            expect(this.casperFriendlyGhost.fate).toBe(1);
            expect(this.player2.fate).toBe(1);
        });

        it('should not allow it\'s controller to steal fate if the opponent has no fate', function () {
            this.player2.player.fate = 0;
            this.casperFriendlyGhost = this.player1.playCharacterFromHand('casper-friendly-ghost');
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });
    });
});
