describe('Consumed by Five Fires Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic', 'doji-diplomat'],
                    hand: ['noble-sacrifice', 'consumed-by-five-guys', 'fine-katana']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'doji-fumiki', 'doji-challenger'],
                    hand: ['reprieve', 'command-the-tributary', 'ornate-fan']
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

            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');

            this.kuwanan.fate = 8;
            this.fumiki.fate = 0;
            this.challenger.fate = 5;
            this.kuwanan.dishonor();
            this.player1.pass();
            this.player2.playAttachment(this.command, this.challenger);
            this.player1.pass();
            this.player2.playAttachment(this.reprieve, this.kuwanan);
        });

        it('should allow choosing a character and remove all fate and attachments from it', function() {
            this.player1.playAttachment(this.katana, this.kuwanan);
            this.player2.playAttachment(this.fan, this.kuwanan);

            this.player1.clickCard(this.consumed);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).toBeAbleToSelect(this.mystic);
            expect(this.player1).toBeAbleToSelect(this.diplomat);
            expect(this.player1).toBeAbleToSelect(this.fumiki);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.fate).toBe(0);
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Consumed by Five Guys to burn Doji Kuwanan, discarding all attachments and fate from it and preventing it from staying in play this round!');
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

        it('should not be playable during a conflict', function() {
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.mystic],
                defenders: [],
                ring: 'earth'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.consumed);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
