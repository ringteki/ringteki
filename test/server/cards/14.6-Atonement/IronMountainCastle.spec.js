describe('Iron Mountain Castle', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-mitsu', 'kakita-yoshi'],
                    hand: ['fine-katana', 'ornate-fan', 'kakita-blade'],
                    stronghold: ['iron-mountain-castle']
                },
                player2: {
                    inPlay: ['togashi-initiate'],
                    hand: ['fine-katana', 'ornate-fan', 'kakita-blade']
                }
            });

            this.mitsu = this.player1.findCardByName('togashi-mitsu');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.blade = this.player1.findCardByName('kakita-blade');
            this.iron = this.player1.findCardByName('iron-mountain-castle');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.katana2 = this.player2.findCardByName('fine-katana');
            this.fan2 = this.player2.findCardByName('ornate-fan');
            this.blade2 = this.player2.findCardByName('kakita-blade');
        });

        it('should reduce the cost to play an attachment on a character you control', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.blade);
            this.player1.clickCard(this.mitsu);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.iron);
            this.player1.clickCard(this.iron);

            expect(this.player1.fate).toBe(fate);
            expect(this.mitsu.attachments.toArray()).toContain(this.blade);

            expect(this.getChatLogs(5)).toContain('player1 uses Iron Mountain Castle, bowing Iron Mountain Castle to reduce the cost of their next attachment by 1');
        });
    });
});
