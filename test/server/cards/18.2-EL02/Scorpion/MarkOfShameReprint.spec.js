describe('Mark of Shame Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [],
                    hand: ['venomous-reputation']
                },
                player2: {
                    inPlay: ['akodo-toturi']
                }
            });
            this.mos = this.player1.findCardByName('venomous-reputation');
            this.toturi = this.player2.findCardByName('akodo-toturi');

            this.player1.playAttachment(this.mos, this.toturi);
            this.player2.pass();
        });

        it('should spend 1 fate dishonor attached character', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.mos);
            expect(this.toturi.isDishonored).toBe(true);
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should not be able to trigger if the character is already dishonored', function() {
            this.toturi.dishonor();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.mos);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
