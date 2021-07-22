describe('Repurpose', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['repurpose', 'imperial-storehouse', 'favorable-ground', 'hida-kisada', 'doji-challenger', 'kakita-toshimoko', 'artisan-academy', 'doji-whisperer']
                }
            });

            this.storehouse = this.player1.findCardByName('imperial-storehouse');
            this.favorableGround = this.player1.findCardByName('favorable-ground');
            this.kisada = this.player1.findCardByName('hida-kisada');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.challenger = this.player1.moveCard('doji-challenger', 'province 1');
            this.toshimoko = this.player1.moveCard('kakita-toshimoko', 'province 1');
            this.academy = this.player1.moveCard('artisan-academy', 'province 1');

            this.repurpose = this.player1.findCardByName('repurpose');

            this.sd1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.sd3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.sd4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.sd5 = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.player1.placeCardInProvince(this.repurpose, 'province 2');
            this.player1.moveCard(this.whisperer, 'dynasty deck');

            this.sd2.isBroken = true;
            this.sd3.isBroken = true;
        });

        it('should allow you to target a holding from your discard', function() {
            this.player1.clickCard(this.repurpose);
            expect(this.player1).toHavePrompt('Choose a holding');
            expect(this.player1).toBeAbleToSelect(this.storehouse);
            expect(this.player1).toBeAbleToSelect(this.favorableGround);
            expect(this.player1).not.toBeAbleToSelect(this.kisada);
            expect(this.player1).not.toBeAbleToSelect(this.academy);
        });

        it('should let you pick a province', function() {
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            expect(this.player1).toHavePrompt('Choose an unbroken province');

            expect(this.player1).toBeAbleToSelect(this.sd1);
            expect(this.player1).not.toBeAbleToSelect(this.sd2);
            expect(this.player1).not.toBeAbleToSelect(this.sd3);
            expect(this.player1).toBeAbleToSelect(this.sd4);
            expect(this.player1).not.toBeAbleToSelect(this.sd5);
        });

        it('should not discard any cards in the picked province', function() {
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            this.player1.clickCard(this.sd1);
            expect(this.challenger.location).toBe('province 1');
            expect(this.toshimoko.location).toBe('province 1');
            expect(this.academy.location).toBe('province 1');
        });

        it('should put the chosen holding in the province faceup and refill faceup', function() {
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            this.player1.clickCard(this.sd1);
            expect(this.storehouse.location).toBe('province 1');
            expect(this.storehouse.facedown).toBe(false);
            expect(this.whisperer.location).toBe('province 2');
            expect(this.whisperer.facedown).toBe(false);
        });

        it('should let you use the chosen holding', function() {
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            this.player1.clickCard(this.sd1);
            this.player2.pass();
            let hand = this.player1.hand.length;
            this.player1.clickCard(this.storehouse);
            expect(this.player1.hand.length).toBe(hand + 1);
        });

        it('should not trigger if there are no eligible provinces', function() {
            this.sd1.isBroken = true;
            this.sd4.isBroken = true;
            this.player1.clickCard(this.repurpose);
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('chat messages', function() {
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(10)).toContain('player1 plays Repurpose to put Imperial Storehouse into a province');
            expect(this.getChatLogs(10)).toContain('player1 places Imperial Storehouse in province 1');
        });

        it('chat messages (faceup province)', function() {
            this.sd1.facedown = false;
            this.player1.clickCard(this.repurpose);
            this.player1.clickCard(this.storehouse);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(10)).toContain('player1 plays Repurpose to put Imperial Storehouse into a province');
            expect(this.getChatLogs(10)).toContain('player1 places Imperial Storehouse in Shameful Display');
        });
    });
});
