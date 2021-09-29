describe('Ramshackle Facade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat']
                },
                player2: {
                    inPlay: ['brash-samurai'],
                    hand: ['fine-katana', 'ornate-fan'],
                    dynastyDiscard: ['floating-fortress', 'imperial-storehouse', 'fire-and-oil']
                }
            });

            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.brash = this.player2.findCardByName('brash-samurai');
            this.fortress = this.player2.findCardByName('floating-fortress');
            this.storehouse = this.player2.findCardByName('imperial-storehouse');
            this.oil = this.player2.findCardByName('fire-and-oil');

            this.fan = this.player2.findCardByName('ornate-fan');
            this.katana = this.player2.findCardByName('fine-katana');

            this.player2.placeCardInProvince(this.fortress, 'province 1');
            this.fortress.facedown = false;
        });

        it('should put a crab holding into the attacked province and discard it at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.fortress);
            expect(this.player2).toBeAbleToSelect(this.oil);
            expect(this.player2).not.toBeAbleToSelect(this.storehouse);
            this.player2.clickCard(this.oil);
            expect(this.player2).toHavePrompt('Select card to discard');
            expect(this.player2).toBeAbleToSelect(this.fan);
            expect(this.player2).toBeAbleToSelect(this.katana);
            this.player2.clickCard(this.katana);
            expect(this.getChatLogs(10)).toContain('player2 uses Floating Fortress, discarding Fine Katana to put Fire and Oil into a province');
            expect(this.getChatLogs(10)).toContain('player2 places Fire and Oil in Shameful Display');
            expect(this.oil.location).toBe('province 1');
            expect(this.oil.facedown).toBe(false);

            this.player1.pass();
            this.player2.clickCard(this.oil);
            this.player2.clickCard(this.diplomat);
            expect(this.diplomat.isDishonored).toBe(true);

            this.noMoreActions();
            expect(this.oil.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(10)).toContain('Fire and Oil is discarded due to Floating Fortress\'s effect');
        });

        it('should not work as the attacking player', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash],
                defenders: [this.diplomat]
            });
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.fortress);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
