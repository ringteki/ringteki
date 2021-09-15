describe('Improvised Infrastructure', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['improvised-infrastructure'],
                    dynastyDiscard: ['imperial-storehouse', 'favorable-ground', 'kakita-toshimoko', 'dispatch-to-nowhere'],
                    provinces: ['dishonorable-assault'],
                    stronghold: 'kyuden-kakita'
                },
                player2: {
                    dynastyDiscard: ['proving-ground']
                }
            });

            this.infrastructure = this.player1.findCardByName('improvised-infrastructure');

            this.assault = this.player1.findCardByName('dishonorable-assault');
            this.kyudenKakita = this.player1.findCardByName('kyuden-kakita');

            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.ground = this.player1.findCardByName('favorable-ground');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.dispatch = this.player1.findCardByName('dispatch-to-nowhere');
            this.grounds = this.player2.findCardByName('proving-ground');

            this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.p22 = this.player2.findCardByName('shameful-display', 'province 2');

            this.player1.placeCardInProvince(this.storehouse, 'province 1');
            this.player1.placeCardInProvince(this.ground, 'province 2');
            this.player1.placeCardInProvince(this.toshimoko, 'province 3');
            this.player1.placeCardInProvince(this.dispatch, 'province 4');
            this.player2.placeCardInProvince(this.grounds, 'province 1');

            this.storehouse.facedown = false;
            this.ground.facedown = false;
            this.toshimoko.facedown = false;
            this.dispatch.facedown = false;
            this.grounds.facedown = false;
        });

        it('should allow you to select a faceup holding in a province', function() {
            this.storehouse.facedown = true;
            this.game.checkGameState(true);

            this.player1.clickCard(this.infrastructure);
            expect(this.player1).toHavePrompt('Choose a holding');
            expect(this.player1).not.toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.ground);
            expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.dispatch);
            expect(this.player1).not.toBeAbleToSelect(this.grounds);
            expect(this.player1).not.toBeAbleToSelect(this.kyudenKakita);
            expect(this.player1).not.toBeAbleToSelect(this.assault);
        });

        it('should allow you to select a faceup holding in a province', function() {
            this.assault.isBroken = true;
            this.game.checkGameState(true);

            this.player1.clickCard(this.infrastructure);
            expect(this.player1).toHavePrompt('Choose a holding');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.ground);
            expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.dispatch);
            expect(this.player1).not.toBeAbleToSelect(this.grounds);
            expect(this.player1).not.toBeAbleToSelect(this.kyudenKakita);
            expect(this.player1).not.toBeAbleToSelect(this.assault);
        });

        it('should allow you to choose an unbroken non-stronghold province controlled by the same player', function() {
            this.p2.isBroken = true;
            this.game.checkGameState(true);

            this.player1.clickCard(this.infrastructure);
            this.player1.clickCard(this.storehouse);

            expect(this.player1).not.toBeAbleToSelect(this.assault);
            expect(this.player1).not.toBeAbleToSelect(this.p2);
            expect(this.player1).toBeAbleToSelect(this.p3);
            expect(this.player1).toBeAbleToSelect(this.p4);
            expect(this.player1).not.toBeAbleToSelect(this.pStronghold);
            expect(this.player1).not.toBeAbleToSelect(this.p22);
        });

        it('should move the card', function() {
            this.player1.clickCard(this.infrastructure);
            this.player1.clickCard(this.storehouse);
            expect(this.storehouse.location).toBe('province 1');
            this.player1.clickCard(this.p2);
            expect(this.storehouse.location).toBe('province 2');

            expect(this.getChatLogs(5)).toContain('player1 plays Improvised Infrastructure to move Imperial Storehouse to province 2');
        });
    });
});
