describe('The Empress\'s Legacy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic', 'kakita-yoshi'],
                    hand: ['the-empress-legacy', 'let-go']
                }
            });
            this.legacy = this.player1.findCardByName('the-empress-legacy');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.letGo = this.player1.findCardByName('let-go');
        });

        it('should cost 2 to attach to a neutral', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.mystic);
            expect(this.player1.fate).toBe(fate - 2);
        });

        it('should cost 1 to attach to a clan character', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.yoshi);
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should allow you to sac to claim the favor', function() {
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.yoshi);
            this.player2.pass();
            this.player1.clickCard(this.legacy);
            expect(this.legacy.location).toBe('conflict discard pile');

            expect(this.player1).toHavePromptButton('Military');
            expect(this.player1).toHavePromptButton('Political');
            this.player1.clickPrompt('military');
            expect(this.player1.player.imperialFavor).toBe('military');
            expect(this.getChatLogs(5)).toContain('player1 uses The Empress\' Legacy, sacrificing The Empress\' Legacy to claim the Emperor\'s favor');
            expect(this.getChatLogs(5)).toContain('player1 claims the Emperor\'s military favor!');
        });

        it('should not be able to be targeted', function() {
            this.player1.clickCard(this.legacy);
            this.player1.clickCard(this.yoshi);
            this.player2.pass();
            this.player1.clickCard(this.letGo);
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.mystic);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
