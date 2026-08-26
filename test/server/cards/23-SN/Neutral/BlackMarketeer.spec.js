describe('Black Marketeer', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['black-marketeer', 'doji-challenger'],
                    conflictDiscard: ['fine-katana']
                },
                player2: {
                    inPlay: [],
                    conflictDiscard: ['ornate-fan', 'naginata']
                }
            });
            this.marketeer = this.player1.findCardByName('black-marketeer');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.naginata = this.player2.findCardByName('naginata');
        });

        it('pays cost to opponent', function () {
            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player1.clickCard(this.marketeer);
            expect(this.player1).not.toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.naginata);

            this.player1.clickCard(this.naginata);
            this.player1.clickCard(this.challenger);

            expect(this.getChatLogs(5)).toContain('player1 uses Black Marketeer to buy an attachment from player2\'s discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Naginata, attaching it to Doji Challenger');

            expect(this.player1.fate).toBe(fate - 1);
            expect(this.player2.fate).toBe(fate2 + 1);
        });

        it('can play zero cost attachments', function () {
            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player1.clickCard(this.marketeer);
            expect(this.player1).not.toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.naginata);

            this.player1.clickCard(this.fan);
            this.player1.clickCard(this.challenger);

            expect(this.getChatLogs(5)).toContain('player1 uses Black Marketeer to buy an attachment from player2\'s discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Ornate Fan, attaching it to Doji Challenger');

            expect(this.player1.fate).toBe(fate);
            expect(this.player2.fate).toBe(fate2);
        });
    });
});
