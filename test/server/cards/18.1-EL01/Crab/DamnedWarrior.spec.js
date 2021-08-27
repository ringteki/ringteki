describe('Damned Warrior', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['damned-warrior']
                },
                player2: {
                    inPlay: []
                }
            });

            this.warrior = this.player1.findCardByName('damned-warrior');
        });

        it('should taint self to stand', function() {
            this.warrior.bow();
            this.game.checkGameState(true);

            this.player1.clickCard(this.warrior);
            expect(this.warrior.bowed).toBe(false);
            expect(this.warrior.isTainted).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 uses Damned Warrior, tainting Damned Warrior to ready Damned Warrior');
        });

        it('should not be able to be used when tainted', function() {
            this.warrior.bow();
            this.warrior.taint();
            this.game.checkGameState(true);

            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.warrior);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
