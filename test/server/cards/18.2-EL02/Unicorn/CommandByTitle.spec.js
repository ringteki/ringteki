describe('Open Field Skirmisher', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['open-field-skirmisher'],
                    hand: ['command-by-title', 'let-go', 'fine-katana']
                },
                player2: {
                    inPlay: ['open-field-skirmisher'],
                    provinces: ['pilgrimage']
                }
            });

            this.skirmisher = this.player1.findCardByName('open-field-skirmisher');
            this.skirmisher2 = this.player2.findCardByName('open-field-skirmisher');
            this.pilgrimage = this.player2.findCardByName('pilgrimage');

            this.command = this.player1.findCardByName('command-by-title');
            this.letGo = this.player1.findCardByName('let-go');
            this.katana = this.player1.findCardByName('fine-katana');
        });

        it('should not trigger outside of a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.command);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should reduce the strength of the province by 2', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skirmisher],
                defenders: [this.skirmisher2],
                type: 'military',
                province: this.pilgrimage
            });

            this.player2.pass();
            let strength = this.pilgrimage.getStrength();
            this.player1.clickCard(this.command);
            expect(this.pilgrimage.getStrength()).toBe(strength - 2);

            expect(this.getChatLogs(5)).toContain('player1 plays Command By Title to reduce the strength of an attacked province');
            expect(this.getChatLogs(5)).toContain('player1 reduces the strength of Pilgrimage by 2');
        });

        it('should prompt you to draw or gain honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skirmisher],
                defenders: [this.skirmisher2],
                type: 'military',
                province: this.pilgrimage
            });

            this.player2.pass();
            this.player1.clickCard(this.command);

            expect(this.player1).toHavePromptButton('Draw a card');
            expect(this.player1).toHavePromptButton('Gain an honor');
        });

        it('draw a card', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skirmisher],
                defenders: [this.skirmisher2],
                type: 'military',
                province: this.pilgrimage
            });

            this.player2.pass();
            let honor = this.player1.honor;
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.command);
            this.player1.clickPrompt('Draw a card');
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.player1.hand.length).toBe(hand); //-1 command, +1 draw
            expect(this.getChatLogs(5)).toContain('player1 chooses to lose 1 honor to draw a card');
        });

        it('gain an honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skirmisher],
                defenders: [this.skirmisher2],
                type: 'military',
                province: this.pilgrimage
            });

            this.player2.pass();
            let honor = this.player1.honor;
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.command);
            this.player1.clickPrompt('Gain an honor');
            expect(this.player1).toBeAbleToSelect(this.letGo);
            expect(this.player1).toBeAbleToSelect(this.katana);
            this.player1.clickCard(this.katana);
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.player1.hand.length).toBe(hand - 2); //-1 command, -1 discard
            expect(this.getChatLogs(5)).toContain('player1 chooses to discard a card to gain 1 honor');
            expect(this.getChatLogs(5)).toContain('player1 discards Fine Katana');
        });
    });
});
