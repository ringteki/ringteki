describe('Kitsuki Chiari', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka-2'],
                    hand: ['ornate-fan', 'fine-katana', 'banzai', 'ornate-fan'],
                    conflictDiscard: ['let-go', 'assassination']
                },
                player2: {
                    inPlay: ['kitsuki-chiari']
                }
            });

            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.filterCardsByName('ornate-fan')[0];
            this.ornateFan2 = this.player1.filterCardsByName('ornate-fan')[1];
            this.banzai = this.player1.findCardByName('banzai');
            this.letGo = this.player1.findCardByName('let-go');
            this.assassinate = this.player1.findCardByName('assassination');

            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka-2');
            this.chiari = this.player2.findCardByName('kitsuki-chiari');
            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p2.facedown = false;
            this.noMoreActions();
        });

        it('should react when your province is revealed', function() {
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                province: this.p1
            });            
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.chiari);
        });

        it('should prompt you to name a card', function() {
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                province: this.p1
            });
            this.player2.clickCard(this.chiari);
            expect(this.player2).toHavePrompt('Name a card');
        });

        it('should let you to name a card and then discard all matching cards from a revealed random subset of your opponent\'s hand', function() {
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                province: this.p1
            });
            let hand = this.player1.hand.length;

            this.player2.clickCard(this.chiari);
            expect(this.player2).toHavePrompt('Name a card');
            this.player2.chooseCardInPrompt(this.ornateFan.name, 'card-name');
            this.player2.clickPrompt('Done');

            expect(this.player1.hand.length).toBe(hand - 2);
            expect(this.getChatLogs(10)).toContain('player2 names Ornate Fan');
            expect(this.getChatLogs(10)).toContain('player2 uses Kitsuki Chiari to name a card and look at 4 random cards in player1\'s hand');
            expect(this.getChatLogs(10)).toContain('player1 reveals Banzai!, Fine Katana, Ornate Fan and Ornate Fan');
            expect(this.getChatLogs(10)).toContain('player1 discards Ornate Fan and Ornate Fan');
        });

        it('hand has no matching cards', function() {
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                province: this.p1
            });
            let hand = this.player1.hand.length;

            this.player2.clickCard(this.chiari);
            expect(this.player2).toHavePrompt('Name a card');
            this.player2.chooseCardInPrompt(this.letGo.name, 'card-name');
            this.player2.clickPrompt('Done');

            expect(this.player1.hand.length).toBe(hand);
            expect(this.getChatLogs(10)).toContain('player2 names Let Go');
            expect(this.getChatLogs(10)).toContain('player2 uses Kitsuki Chiari to name a card and look at 4 random cards in player1\'s hand');
            expect(this.getChatLogs(10)).toContain('player1 reveals Banzai!, Fine Katana, Ornate Fan and Ornate Fan');
            expect(this.getChatLogs(10)).toContain('player1 does not discard anything');
        });
    });
});

