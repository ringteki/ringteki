describe('Treasured Gift', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-kazue', 'seppun-guardsman'],
                    dynastyDeck: ['favorable-ground']
                },
                player2: {
                    inPlay: ['solemn-scholar'],
                    hand: ['treasured-gift']
                }
            });
            this.togashiKazue = this.player1.findCardByName('togashi-kazue');
            this.guardsman = this.player1.findCardByName('seppun-guardsman');
            this.gift = this.player2.findCardByName('treasured-gift');
            this.favorableGround = this.player1.placeCardInProvince('favorable-ground');
            this.scholar = this.player2.findCardByName('solemn-scholar');
            this.player1.pass();
        });

        it('should only be playable on an opponent\'s character', function() {
            this.player2.clickCard(this.gift);
            expect(this.player2).toBeAbleToSelect(this.togashiKazue);
            expect(this.player2).toBeAbleToSelect(this.guardsman);
            expect(this.player2).not.toBeAbleToSelect(this.scholar);
        });

        it('should prevent attached character from assigning as an attacker', function() {
            this.player2.clickCard(this.gift);
            this.player2.clickCard(this.togashiKazue);

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardsman, this.togashiKazue],
                defenders: []
            });

            expect(this.game.currentConflict.attackers).not.toContain(this.togashiKazue);
        });

        it('should let the character move in', function() {
            this.player2.clickCard(this.gift);
            this.player2.clickCard(this.togashiKazue);
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.guardsman, this.togashiKazue],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.favorableGround);
            expect(this.player1).toBeAbleToSelect(this.togashiKazue);
            this.player1.clickCard(this.togashiKazue);
            expect(this.togashiKazue.inConflict).toBe(true);
        });

        it('should let the character be declared as a defender', function() {
            this.player2.clickCard(this.gift);
            this.player2.clickCard(this.togashiKazue);

            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                defenders: [this.guardsman, this.togashiKazue],
                attackers: [this.scholar]
            });

            expect(this.game.currentConflict.defenders).toContain(this.togashiKazue);
        });
    });
});
