describe('Accursed Summoning', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    hand: ['accursed-summoning']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });

            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.whisperer = this.player2.findCardByName('doji-whisperer');

            this.summoning = this.player1.findCardByName('accursed-summoning');
        });

        it('should not trigger out of conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.summoning);
            expect(this.player1.player.cardsInPlay.filter(a => a.id === 'oni-of-obsidian-and-blood').length).toBe(1);
            
            this.oni = this.player1.player.cardsInPlay.filter(a => a.id === 'oni-of-obsidian-and-blood')[0];
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});