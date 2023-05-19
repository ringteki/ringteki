describe('Lion Box', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: 'lion-box',
                    inPlay: ['fushicho'],
                    hand: ['ornate-fan']
                },
                player2: {
                    inPlay: ['bayushi-manipulator']
                }
            });
            this.lionBox = this.player1.findCardByName('lion-box');
            this.fushicho = this.player1.findCardByName('fushicho');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');
        });

        it('draws a card on attack', function () {
            const initialHandSize = this.player1.hand.length;
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.fushicho],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.lionBox);
            expect(this.player1).toHavePrompt('Select card to discard');

            this.player1.clickCard(this.ornateFan);
            expect(this.player1.hand.length).toBe(initialHandSize + 1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Lion Box, bowing Lion Box and discarding Ornate Fan to draw 2 cards'
            );
        });

        it('draws a card on defense', function () {
            const initialHandSize = this.player1.hand.length;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.bayushiManipulator],
                defenders: [this.fushicho]
            });

            this.player1.clickCard(this.lionBox);
            expect(this.player1).toHavePrompt('Select card to discard');

            this.player1.clickCard(this.ornateFan);
            expect(this.player1.hand.length).toBe(initialHandSize + 1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Lion Box, bowing Lion Box and discarding Ornate Fan to draw 2 cards'
            );
        });

        it('does not work without a participating character', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.bayushiManipulator],
                defenders: []
            });

            this.player1.clickCard(this.lionBox);
            expect(this.player1).not.toHavePrompt('Select card to discard');
        });
    });
});
