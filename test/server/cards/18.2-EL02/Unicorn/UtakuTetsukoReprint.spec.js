describe('Utaku Tetsuko Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['definitely-not-tetsuko'],
                    hand: ['ornate-fan']
                },
                player2: {
                    honor: 10,
                    inPlay: ['definitely-not-tetsuko'],
                    hand: ['fine-katana', 'seal-of-the-crane', 'seal-of-the-lion']
                }
            });

            this.tetsuko1 = this.player1.findCardByName('definitely-not-tetsuko');
            this.tetsuko2 = this.player2.findCardByName('definitely-not-tetsuko');
            this.fan = this.player1.findCardByName('ornate-fan');

            this.katana = this.player2.findCardByName('fine-katana');
            this.seal1 = this.player2.findCardByName('seal-of-the-crane');
            this.seal2 = this.player2.findCardByName('seal-of-the-lion');
        });

        it('should react to cards being played on attack', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tetsuko1],
                defenders: [this.tetsuko2]
            });

            let p1Fate = this.player1.fate;
            let p2Fate = this.player2.fate;

            this.player2.playAttachment(this.katana, this.tetsuko2);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tetsuko1);
            this.player1.clickCard(this.tetsuko1);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.player1.fate).toBe(p1Fate + 1);
            expect(this.player2.fate).toBe(p2Fate - 1);
            expect(this.getChatLogs(5)).toContain('player1 uses Definitely Not Tetsuko to take 1 fate from player2');

            this.player1.playAttachment(this.fan, this.tetsuko1);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.player2.playAttachment(this.seal1, this.tetsuko2);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.tetsuko1);
            this.player1.clickCard(this.tetsuko1);
            expect(this.player1.fate).toBe(p1Fate + 2);
            expect(this.player2.fate).toBe(p2Fate - 2);

            this.player1.pass();
            this.player2.playAttachment(this.seal2, this.tetsuko2);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
