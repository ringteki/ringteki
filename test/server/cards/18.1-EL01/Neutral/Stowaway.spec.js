describe('Stowaway', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['stowaway'],
                    dynastyDiscard: ['iron-mine'],
                    conflictDiscard: ['let-go']
                },
                player2: {
                    hand: ['assassination'],
                    dynastyDiscard: ['imperial-storehouse'],
                    conflictDiscard: ['ornate-fan']
                }
            });

            this.stowaway = this.player1.findCardByName('stowaway');
            this.mine = this.player1.findCardByName('iron-mine');
            this.letGo = this.player1.findCardByName('let-go');

            this.assassination = this.player2.findCardByName('assassination');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.storehouse = this.player2.findCardByName('imperial-storehouse');
        });

        it('should let you pick a card in a discard pile and put it underneath and RFG when this leaves play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.stowaway],
                defenders: []
            });

            this.player2.pass();
            this.player1.clickCard(this.stowaway);
            expect(this.player1).toBeAbleToSelect(this.mine);
            expect(this.player1).toBeAbleToSelect(this.letGo);
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.fan);

            let mil = this.stowaway.getMilitarySkill();

            this.player1.clickCard(this.storehouse);
            expect(this.stowaway.getMilitarySkill()).toBe(mil + 1);
            expect(this.storehouse.location).toBe(this.stowaway.uuid);

            expect(this.getChatLogs(5)).toContain('player1 uses Stowaway to place Imperial Storehouse beneath Stowaway');

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.stowaway);
            expect(this.storehouse.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Imperial Storehouse is removed from the game due to Stowaway leaving play');
        });
    });
});
