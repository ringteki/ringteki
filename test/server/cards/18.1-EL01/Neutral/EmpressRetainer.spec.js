describe('Empress\'s Retainer', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['empress-s-retainer']
                },
                player2: {
                }
            });

            this.retainer = this.player1.findCardByName('empress-s-retainer');
        });

        it('should let you toss favor to move home (p1)', function() {
            this.player1.player.imperialFavor = 'military';

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.retainer],
                defenders: []
            });
            this.player2.clickCard(this.retainer);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.pass();
            this.player1.clickCard(this.retainer);
            expect(this.retainer.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Empress\'s Retainer, discarding the Imperial Favor to send Empress\'s Retainer home');
        });

        it('should let you toss favor to move home (p2)', function() {
            this.player2.player.imperialFavor = 'military';

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.retainer],
                defenders: []
            });
            this.player2.clickCard(this.retainer);
            expect(this.retainer.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 uses Empress\'s Retainer, discarding the Imperial Favor to send Empress\'s Retainer home');
        });
    });
});
