describe('Sturdy Tetsubo', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'bayushi-manipulator'],
                    hand: ['sturdy-tetsubo', 'ornate-fan', 'fine-katana']
                },
                player2: {
                    inPlay: ['yogo-hiroue'],
                    hand: ['assassination', 'let-go']
                }
            });

            this.liar = this.player1.findCardByName('bayushi-liar');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.yogoHiroue = this.player2.findCardByName('yogo-hiroue');
            this.tetsubo = this.player1.findCardByName('sturdy-tetsubo');

            this.fan = this.player1.findCardByName('ornate-fan');
            this.katana = this.player1.findCardByName('fine-katana');

            this.assassination = this.player2.findCardByName('assassination');
            this.letGo = this.player2.findCardByName('let-go');
        });

        it('should make opponent discard a card when parent wins a conflict', function () {
            this.player1.playAttachment(this.tetsubo, this.manipulator);
            this.noMoreActions();
            let hand = this.player2.hand.length;

            this.initiateConflict({
                type: 'political',
                attackers: [this.liar, this.manipulator],
                defenders: [this.yogoHiroue]
            });
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.manipulator);
            expect(this.player1).not.toBeAbleToSelect(this.tetsubo);
            this.player1.clickCard(this.manipulator);
            expect(this.player2).toHavePrompt('Choose a card to discard');
            expect(this.player2).toBeAbleToSelect(this.assassination);
            expect(this.player2).toBeAbleToSelect(this.letGo);
            expect(this.assassination.location).toBe('hand');
            this.player2.clickCard(this.assassination);
            expect(this.assassination.location).toBe('conflict discard pile');
            expect(this.player2.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(10)).toContain('player1 uses Bayushi Manipulator\'s gained ability from Sturdy Tetsubō to make player2 discard 1 cards');
            expect(this.getChatLogs(10)).toContain('player2 discards Assassination');
        });

        it('can\'t trigger at home', function () {
            this.player1.playAttachment(this.tetsubo, this.manipulator);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.liar],
                defenders: []
            });
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilites');
        });

        it('can\'t trigger after losing the conflict', function () {
            this.player1.playAttachment(this.tetsubo, this.manipulator);
            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.manipulator],
                defenders: [this.yogoHiroue]
            });
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilites');
        });

        it('attaching to an opponents character', function () {
            this.player1.playAttachment(this.tetsubo, this.yogoHiroue);
            this.noMoreActions();
            let hand = this.player1.hand.length;

            this.initiateConflict({
                type: 'political',
                attackers: [this.manipulator],
                defenders: [this.yogoHiroue]
            });
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.yogoHiroue);
            expect(this.player2).not.toBeAbleToSelect(this.tetsubo);
            this.player2.clickCard(this.yogoHiroue);
            expect(this.player1).toHavePrompt('Choose a card to discard');
            expect(this.player1).toBeAbleToSelect(this.fan);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.fan.location).toBe('hand');
            this.player1.clickCard(this.fan);
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.player1.hand.length).toBe(hand - 1);
            expect(this.getChatLogs(10)).toContain('player2 uses Yogo Hiroue\'s gained ability from Sturdy Tetsubō to make player1 discard 1 cards');
            expect(this.getChatLogs(10)).toContain('player1 discards Ornate Fan');
        });
    });
});
