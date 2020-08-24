describe('Master Of Many Lifetimes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-many-lifetimes', 'matsu-berserker'],
                    hand: ['fine-katana', 'ornate-fan']
                },
                player2: {
                    inPlay: ['keeper-initiate'],
                    hand: ['assassination']
                }
            });

            this.moml = this.player1.findCardByName('master-of-many-lifetimes');
            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.shameful = this.player1.findCardByName('shameful-display', 'province 1');

            this.keeper = this.player2.findCardByName('keeper-initiate');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('should trigger when a character you control would leave play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
        });

        it('should not trigger when a character you don\'t control would leave play', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: [this.keeper]
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.keeper);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should return all attachments to hand and the character to the chosen province', function() {
            this.player1.playAttachment(this.fineKatana, this.berserker);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.berserker],
                defenders: []
            });

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.berserker);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.moml);
            this.player1.clickCard(this.moml);
            this.player1.clickCard(this.shameful);

            expect(this.berserker.location).toBe(this.shameful);
            expect(this.fineKatana.location).toBe('hand');
            expect(this.player1).toHavePrompt('conflict action window');
        });
    });
});
