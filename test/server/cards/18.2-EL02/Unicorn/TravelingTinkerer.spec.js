describe('Spearhead', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi', 'traveling-tinkerer'],
                    hand: ['spearhead', 'fine-katana', 'a-new-name']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'doji-challenger'],
                    hand: ['ornate-fan', 'kakita-blade']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.tinkerer = this.player1.findCardByName('traveling-tinkerer');
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.spearhead = this.player1.findCardByName('spearhead');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.ann = this.player1.findCardByName('a-new-name');
            this.blade = this.player2.findCardByName('kakita-blade');
            this.player1.playAttachment(this.katana, this.tinkerer);
            this.player2.playAttachment(this.fan, this.tinkerer);
            this.player1.playAttachment(this.ann, this.challenger);
            this.player2.playAttachment(this.blade, this.challenger);
        });

        it('should sac an attachment to gain a fate', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.tinkerer);

            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).not.toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.ann);
            expect(this.player1).not.toBeAbleToSelect(this.blade);

            let fate = this.player1.fate;
            let honor = this.player1.honor;
            this.player1.clickCard(this.ann);
            expect(this.player1.fate).toBe(fate + 1);
            expect(this.player1.honor).toBe(honor);
            expect(this.ann.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Traveling Tinkerer, sacrificing A New Name to gain 1 fate');
        });

        it('should sac an attachment to gain a fate and an honor (on a merchant)', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.tinkerer);
            let fate = this.player1.fate;
            let honor = this.player1.honor;
            this.player1.clickCard(this.katana);
            expect(this.player1.fate).toBe(fate + 1);
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Traveling Tinkerer, sacrificing Fine Katana to gain 1 fate and 1 honor');
        });
    });
});
