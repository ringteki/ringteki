describe('Lessons From Earth', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-kuwanan'],
                    hand: ['ornate-fan', 'fine-katana', 'lessons-from-earth']
                },
                player2: {
                    inPlay: ['isawa-tadaka-2'],
                    hand: ['ornate-fan', 'fine-katana']
                }
            });

            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.tadaka = this.player2.findCardByName('isawa-tadaka-2');

            this.lessons = this.player1.findCardByName('lessons-from-earth');

            this.fan = this.player1.findCardByName('ornate-fan');
            this.katana = this.player1.findCardByName('fine-katana');

            this.sd = this.player2.findCardByName('shameful-display', 'province 1');

            this.player1.clickCard(this.lessons);
            this.player1.clickCard(this.sd);
        });

        it('no affinity', function () {
            this.tadaka.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.tadaka],
                province: this.sd
            });

            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 uses Lessons from Earth to cause player2 to draw a card and player1 to discard a card');
            expect(this.player1).toHavePrompt('Lessons from Earth');
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.katana);
            this.player1.clickCard(this.fan);
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 discards Ornate Fan');

            expect(this.player1.hand.length).toBe(hand - 1);
            expect(this.player2.hand.length).toBe(hand2 + 1);
        });

        it('affinity', function () {
            this.kuwanan.honor();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.tadaka],
                province: this.sd
            });

            let hand = this.player1.hand.length;
            let hand2 = this.player2.hand.length;

            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player1 uses Lessons from Earth to cause player1 to draw a card and player2 to discard a card');
            expect(this.player2).not.toHavePrompt('Lessons from Earth');
            expect(this.getChatLogs(5)).toContain('player2\'s affinity to Earth prevents them from discarding a card!');

            expect(this.player1.hand.length).toBe(hand + 1);
            expect(this.player2.hand.length).toBe(hand2);
        });

    });
});

