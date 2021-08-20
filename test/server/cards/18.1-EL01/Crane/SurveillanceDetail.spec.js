describe('Surveillance Detail', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['moto-youth', 'utaku-infantry'],
                    stronghold: ['golden-plains-outpost'],
                    hand: ['fine-katana', 'ornate-fan', 'assassination']
                },
                player2: {
                    honor: 10,
                    inPlay: ['doji-challenger'],
                    hand: ['surveillance-detail']
                }
            });

            this.youth = this.player1.findCardByName('moto-youth');
            this.infantry = this.player1.findCardByName('utaku-infantry');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.gpo = this.player1.findCardByName('golden-plains-outpost');
            this.detail = this.player2.findCardByName('surveillance-detail');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.assassination = this.player1.findCardByName('assassination');

            this.player1.pass();
            this.player2.playAttachment(this.detail, this.youth);
        });

        it('should trigger on declaration as attacker', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.youth]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.detail);
            this.player2.clickCard(this.detail);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.assassination);
            this.player1.clickCard(this.katana);
            expect(this.getChatLogs(5)).toContain('player2 uses Surveillance Detail to make player1 discard 1 cards');
            expect(this.getChatLogs(5)).toContain('player1 discards Fine Katana');
            expect(this.katana.location).toBe('conflict discard pile');
        });

        it('should not trigger on movement', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.infantry],
                defenders: [],
                type: 'military'
            });
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            this.player2.pass();
            this.player1.clickCard(this.gpo);
            this.player1.clickCard(this.youth);

            expect(this.player2).not.toHavePrompt('Triggered Abilities');
        });

        it('should trigger on declaration as defender', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.youth]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.detail);
            this.player2.clickCard(this.detail);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.assassination);
            this.player1.clickCard(this.assassination);
            expect(this.getChatLogs(5)).toContain('player2 uses Surveillance Detail to make player1 discard 1 cards');
            expect(this.getChatLogs(5)).toContain('player1 discards Assassination');
            expect(this.assassination.location).toBe('conflict discard pile');
        });
    });
});
