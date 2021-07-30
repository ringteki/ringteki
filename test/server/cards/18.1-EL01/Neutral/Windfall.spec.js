describe('Windfall', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-challenger'],
                    hand: ['windfall']
                },
                player2: {
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.windfall = this.player1.findCardByName('windfall');
        });

        it('should put a fate on a character with cost 2 or less', function() {
            this.player1.clickCard(this.windfall);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            this.player1.clickCard(this.brash);
            expect(this.brash.fate).toBe(1);
        });
    });
});
