describe('Spearhead', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-cho'],
                    hand: ['ayubune-pilot', 'a-new-name']
                },
                player2: {
                    inPlay: ['doji-whisperer', 'doji-challenger'],
                    hand: ['ornate-fan', 'kakita-blade']
                }
            });

            this.cho = this.player1.findCardByName('akodo-cho');
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.pilot = this.player1.findCardByName('ayubune-pilot');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.ann = this.player1.findCardByName('a-new-name');
            this.blade = this.player2.findCardByName('kakita-blade');
            this.player1.playAttachment(this.pilot, this.cho);
            this.player2.playAttachment(this.fan, this.challenger);
            this.player1.playAttachment(this.ann, this.cho);
            this.player2.playAttachment(this.blade, this.challenger);
        });

        it('should not work outside of conflicts', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.cho);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should sac an attachment to let you choose a character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.cho],
                defenders: [this.dojiWhisperer, this.challenger],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.cho);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.pilot);
            expect(this.player1).not.toBeAbleToSelect(this.ann);
            this.player1.clickCard(this.pilot);

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.cho);
            expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Choose an attachment to discard');
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.blade);
            this.player1.clickCard(this.blade);

            expect(this.blade.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Cho, sacrificing Ayubune Pilot to discard an attachment on Doji Challenger');
            expect(this.getChatLogs(5)).toContain('player1 discards Kakita Blade');
        });

        it('should bow if chosen character has no attachments', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.cho],
                defenders: [this.dojiWhisperer, this.challenger],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.cho);
            expect(this.player1).toHavePrompt('Select card to sacrifice');
            expect(this.player1).toBeAbleToSelect(this.pilot);
            expect(this.player1).not.toBeAbleToSelect(this.ann);
            this.player1.clickCard(this.pilot);

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.cho);
            expect(this.player1).toBeAbleToSelect(this.dojiWhisperer);
            expect(this.player1).toBeAbleToSelect(this.challenger);

            this.player1.clickCard(this.dojiWhisperer);
            expect(this.player1).not.toHavePrompt('Choose an attachment to discard');
            expect(this.dojiWhisperer.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo Cho, sacrificing Ayubune Pilot to bow Doji Whisperer');
        });
    });
});
