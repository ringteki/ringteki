describe('Spirit of Valor', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doomed-shugenja'],
                    hand: ['spirit-of-valor'],
                    dynastyDiscard: ['brash-samurai', 'doji-whisperer']
                },
                player2: {
                    inPlay: [],
                    hand: ['assassination', 'let-go']
                }
            });

            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.valor = this.player1.findCardByName('spirit-of-valor');

            this.brash = this.player1.findCardByName('brash-samurai');
            this.whisperer = this.player1.findCardByName('doji-whisperer');

            this.assassination = this.player2.findCardByName('assassination');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('should react to entering play', function() {
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.doomed);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.valor);
        });

        it('should let you put a bushi into play and move this attachment to it', function() {
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.doomed);
            this.player1.clickCard(this.valor);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            expect(this.valor.parent).toBe(this.doomed);
            this.player1.clickCard(this.brash);
            expect(this.getChatLogs(5)).toContain('player1 uses Spirit of Valor to put Brash Samurai into play');
            expect(this.brash.location).toBe('play area');
            expect(this.valor.parent).toBe(this.brash);
        });

        it('should remove attached character from game if it leaves play', function() {
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.doomed);
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.brash);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: []
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.brash);
            expect(this.brash.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Brash Samurai is removed from the game due to the effects of Spirit of Valor');
        });

        it('should not remove attached character from game if attachment leaves play first', function() {
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.doomed);
            this.player1.clickCard(this.valor);
            this.player1.clickCard(this.brash);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: []
            });
            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.valor);

            this.player1.pass();

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.brash);
            expect(this.brash.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).not.toContain('Brash Samurai is removed from the game due to the effects of Spirit of Valor');
        });
    });
});
