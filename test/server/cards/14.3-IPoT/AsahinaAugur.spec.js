describe('Asahina Augur', function() {
    integration(function() {
        describe('Asahina Augur\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asahina-augur'],
                        dynastyDeck: ['doji-challenger', 'doji-whisperer']
                    }
                });
                this.dojiChallenger = this.player1.placeCardInProvince('doji-challenger', 'province 1');
                this.dojiChallenger.facedown = true;
                this.dojiWhisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 2');
                this.dojiWhisperer.facedown = true;
            });

            it('should allow facedown cards to be seen', function() {
                this.game.checkGameState(true);
                expect(this.dojiChallenger.hideWhenFacedown()).toBe(false);
            });

            it('should allow a card to be discarded', function() {
                this.player1.clickCard('asahina-augur');
                expect(this.player1).toHavePrompt('Choose a card');
                this.player1.clickCard(this.dojiChallenger);
                expect(this.dojiChallenger.location).toBe('dynasty discard pile');
                expect(this.player2).toHavePrompt('Action Window');
                expect(this.getChatLogs(3)).toContain('player1 uses Asahina Augur to discard a facedown card in province 1');
            });
        });
    });
});
