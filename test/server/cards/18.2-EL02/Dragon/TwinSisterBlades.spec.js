describe('Twin Sister Blades', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mirumoto-raitsugu'],
                    hand: ['twin-sister-blades','fine-katana','ornate-fan']
                },
                player2: {
                    inPlay: ['doji-whisperer']
                }
            });
            this.mirumotoRaitsugu = this.player1.findCardByName('mirumoto-raitsugu');
            this.mirumotoDaisho = this.player1.findCardByName('twin-sister-blades');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('during a duel the attached character is participating, the opponent should not be able to bid 4 or 5', function() {
            this.player1.clickCard(this.mirumotoDaisho);
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.dojiWhisperer]
            });
            this.player2.pass();
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickCard(this.dojiWhisperer);
            expect(this.player1).toHavePrompt('Choose your bid for the duel\nMirumoto Raitsugu: 5 vs 0: Doji Whisperer');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player2).toHavePrompt('Choose your bid for the duel\nMirumoto Raitsugu: 5 vs 0: Doji Whisperer');
            expect(this.player2).toHavePromptButton('1');
            expect(this.player2).toHavePromptButton('2');
            expect(this.player2).toHavePromptButton('3');
            expect(this.player2).not.toHavePromptButton('4');
            expect(this.player2).not.toHavePromptButton('5');
        });

        it('should let you reduce honor transfer', function() {
            this.player1.clickCard(this.mirumotoDaisho);
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.dojiWhisperer]
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickCard(this.dojiWhisperer);
            this.player1.clickPrompt('3');
            this.player2.clickPrompt('1');
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.player2.honor).toBe(honor2 + 1);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('player1 gives player2 1 honor');
        });

        it('should let you reduce honor transfer to 0', function() {
            this.player1.clickCard(this.mirumotoDaisho);
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.dojiWhisperer]
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickCard(this.dojiWhisperer);
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            expect(this.getChatLogs(10)).toContain('player1 gives player2 0 honor');
        });

        it('should not reduce gains', function() {
            this.player1.clickCard(this.mirumotoDaisho);
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.mirumotoRaitsugu],
                defenders: [this.dojiWhisperer]
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();
            this.player1.clickCard(this.mirumotoRaitsugu);
            this.player1.clickCard(this.dojiWhisperer);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');
            expect(this.player1.honor).toBe(honor + 2);
            expect(this.player2.honor).toBe(honor2 - 2);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('player2 gives player1 2 honor');
        });
    });
});
