xdescribe('007 at Court', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'miya-mystic'],
                    hand: ['007-at-court']
                },
                player2: {
                    hand: ['fine-katana', 'ornate-fan', 'finger-of-jade', 'elegant-tessen']
                }
            });
            this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
            this.miyaMystic = this.player1.findCardByName('miya-mystic');
            this.atCourt = this.player1.findCardByName('007-at-court');

            this.katana = this.player2.findCardByName('fine-katana');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.finger = this.player2.findCardByName('finger-of-jade');

            this.noMoreActions();
        });

        it('forces chosen discard without dishonoring a character', function () {
            this.initiateConflict({
                type: 'political',
                attackers: [this.bayushiLiar, this.miyaMystic],
                defenders: [],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.atCourt);

            this.player1.clickCard(this.atCourt);
            expect(this.player1).toHavePrompt('Select character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Done');
            expect(this.player2).toHavePrompt('Choose 3 cards to discard');

            this.player2.clickCard(this.katana);
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.finger);
            this.player2.clickPrompt('Done');
            expect(this.getChatLogs(5)).toContain('player1 plays 007 at court to make player2 discard 3 cards');
        });

        it('forces random discard by dishonoring a courtier', function () {
            this.initiateConflict({
                type: 'political',
                attackers: [this.bayushiLiar, this.miyaMystic],
                defenders: [],
                jumpTo: 'afterConflict'
            });
            expect(this.player1).toHavePrompt('Any reactions?');
            expect(this.player1).toBeAbleToSelect(this.atCourt);

            this.player1.clickCard(this.atCourt);
            expect(this.player1).toHavePrompt('Select character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.bayushiLiar);
            expect(this.player1).not.toBeAbleToSelect(this.miyaMystic);
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickCard(this.bayushiLiar);
            expect(this.getChatLogs(5)).toContain(
                'player1 plays 007 at court, dishonoring Bayushi Liar to make player2 discard 3 cards at random'
            );
        });
    });
});
