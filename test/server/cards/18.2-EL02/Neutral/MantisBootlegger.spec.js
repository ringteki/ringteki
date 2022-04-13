describe('Mantis Bootlegger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-mitsu', 'kakita-yoshi', 'mantis-bootlegger'],
                    hand: ['fine-katana', 'ornate-fan', 'kakita-blade', 'honored-blade', 'tattooed-wanderer']
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
            this.honored = this.player1.findCardByName('honored-blade');
            this.wanderer = this.player1.findCardByName('tattooed-wanderer');
            this.bootlegger = this.player1.findCardByName('mantis-bootlegger');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.katana2 = this.player2.findCardByName('fine-katana');
            this.fan2 = this.player2.findCardByName('ornate-fan');
            this.blade2 = this.player2.findCardByName('kakita-blade');
        });

        it('should reduce the cost to play an attachment on a character you control', function() {
            let fate = this.player1.fate;
            let honor = this.player1.honor;
            this.player1.clickCard(this.blade);
            this.player1.clickCard(this.mitsu);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bootlegger);
            this.player1.clickCard(this.bootlegger);

            expect(this.player1.fate).toBe(fate);
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.mitsu.attachments.toArray()).toContain(this.blade);

            expect(this.getChatLogs(5)).toContain('player1 uses Mantis Bootlegger, losing 1 honor to reduce the cost of their next attachment by 1');
        });

        it('should reduce the cost to play an attachment on a character you don\'t control', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.blade);
            this.player1.clickCard(this.initiate);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bootlegger);
            this.player1.clickCard(this.bootlegger);

            expect(this.player1.fate).toBe(fate);
            expect(this.initiate.attachments.toArray()).toContain(this.blade);
        });

        it('should not trigger if attachment is played by opponent', function() {
            this.player1.pass();
            this.player2.clickCard(this.blade2);
            this.player2.clickCard(this.mitsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.mitsu.attachments.toArray()).toContain(this.blade2);
        });

        it('should not trigger if character has an attachment', function() {
            this.player1.pass();
            this.player2.clickCard(this.blade2);
            this.player2.clickCard(this.mitsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.mitsu.attachments.toArray()).toContain(this.blade2);

            this.player1.clickCard(this.blade);
            this.player1.clickCard(this.mitsu);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.mitsu.attachments.toArray()).toContain(this.blade);
        });

        it('should work twice per round but not 3 times per round', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.wanderer);
            this.player1.clickPrompt('Play Tattooed Wanderer as an attachment');
            this.player1.clickCard(this.mitsu);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bootlegger);
            this.player1.clickCard(this.bootlegger);

            expect(this.player1.fate).toBe(fate);
            expect(this.mitsu.attachments.toArray()).toContain(this.wanderer);

            this.player2.pass();
            this.player1.clickCard(this.blade);
            this.player1.clickCard(this.initiate);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bootlegger);
            this.player1.clickCard(this.bootlegger);

            expect(this.player1.fate).toBe(fate);
            expect(this.initiate.attachments.toArray()).toContain(this.blade);

            this.player2.pass();

            this.player1.clickCard(this.honored);
            this.player1.clickCard(this.yoshi);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.bootlegger);

            expect(this.player1.fate).toBe(fate - 1);
            expect(this.yoshi.attachments.toArray()).toContain(this.honored);
        });
    });
});
