describe('Consumed by Five Fires Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic', 'doji-diplomat'],
                    hand: ['noble-sacrifice', 'consumed-by-five-guys']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'doji-fumiki', 'doji-challenger'],
                    hand: ['reprieve', 'command-the-tributary']
                }
            });

            this.mystic = this.player1.findCardByName('miya-mystic');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.diplomat.honor();
            this.mystic.fate = 2;
            this.consumed = this.player1.findCardByName('consumed-by-five-guys');
            this.sac = this.player1.findCardByName('noble-sacrifice');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.fumiki = this.player2.findCardByName('doji-fumiki');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.command = this.player2.findCardByName('command-the-tributary');
            this.reprieve = this.player2.findCardByName('reprieve');

            this.kuwanan.fate = 5;
            this.fumiki.fate = 0;
            this.challenger.fate = 8;
            this.kuwanan.dishonor();
            this.player1.pass();
            this.player2.playAttachment(this.command, this.challenger);
            this.player1.pass();
            this.player2.playAttachment(this.reprieve, this.kuwanan);
        });

        it('should allow choosing a character and remove 5 fate from it', function() {
            let fate = this.kuwanan.fate;
            this.player1.clickCard(this.consumed);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).toBeAbleToSelect(this.mystic);
            expect(this.player1).toBeAbleToSelect(this.diplomat);
            expect(this.player1).toBeAbleToSelect(this.fumiki);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.fate).toBe(fate - 5);
            expect(this.getChatLogs(5)).toContain('player1 plays Consumed by Five Guys to burn Doji Kuwanan, removing 5 fate and preventing it from staying in play this round!');
        });

        it('should allow choosing a character and remove 5 fate from it (more than 5)', function() {
            let fate = this.challenger.fate;
            this.player1.clickCard(this.consumed);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.fate).toBe(fate - 5);
        });

        it('should allow choosing a character and remove 5 fate from it (less than 5)', function() {
            let fate = this.mystic.fate;
            this.player1.clickCard(this.consumed);
            this.player1.clickCard(this.mystic);
            expect(this.mystic.fate).not.toBe(fate - 5);
            expect(this.mystic.fate).toBe(0);
        });

        it('should not allow saving the target', function() {
            this.player1.clickCard(this.consumed);
            this.player1.clickCard(this.kuwanan);
            this.player2.pass();
            this.player1.clickCard(this.sac);
            this.player1.clickCard(this.kuwanan);
            this.player1.clickCard(this.diplomat);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.kuwanan.location).toBe('dynasty discard pile');
        });

        it('should not be able to put fate on it', function() {
            this.player1.clickCard(this.consumed);
            this.player1.clickCard(this.kuwanan);
            this.player2.clickCard(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player2).toBeAbleToSelect(this.fumiki);
            this.player2.clickCard(this.fumiki);
            expect(this.fumiki.fate).toBe(1);
        });
    });
});
