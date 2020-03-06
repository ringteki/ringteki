describe('Our Foe Does Not Wait', function() {
    integration(function() {
        describe('Our Foe Does Not Wait\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['imperial-storehouse', 'solemn-scholar', 'seventh-tower', 'watchtower-of-valor' ,'favorable-ground', 'hida-kisada', 'artisan-academy', 'hall-of-victories'],
                        hand: ['our-foe-does-not-wait'],
                        dynastyDeckSize: 4
                    }
                });

                this.ourFoe = this.player1.findCardByName('our-foe-does-not-wait');
                this.seventhTower = this.player1.findCardByName('seventh-tower');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.storehouse = this.player1.findCardByName('imperial-storehouse');
                this.favorableGround = this.player1.findCardByName('favorable-ground');
                this.kisada = this.player1.findCardByName('hida-kisada');
                this.artisanAcademy = this.player1.findCardByName('artisan-academy');
                this.hallOfVictories = this.player1.findCardByName('hall-of-victories');
                this.player1.moveCard(this.storehouse, 'dynasty deck');
                this.player1.moveCard(this.scholar, 'dynasty deck');
                this.player1.moveCard(this.favorableGround, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
                this.player1.moveCard(this.artisanAcademy, 'dynasty deck');
                this.player1.moveCard(this.hallOfVictories, 'dynasty deck');
                this.player1.moveCard(this.seventhTower, 'dynasty deck');

                this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
                this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

                this.noMoreActions();
                this.player1.clickPrompt('Pass Conflict');
                this.player1.clickPrompt('Yes');
            });

            it('should trigger when conflict is passed', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ourFoe);
            });

            it('should let you trigger a non-stronghold province', function() {
                this.player1.clickCard(this.ourFoe);
                expect(this.player1).toHavePrompt('Our For Does Not Wait');
                expect(this.player1).toBeAbleToSelect(this.p1);
                expect(this.player1).toBeAbleToSelect(this.p2);
                expect(this.player1).toBeAbleToSelect(this.p3);
                expect(this.player1).toBeAbleToSelect(this.p4);
                expect(this.player1).not.toBeAbleToSelect(this.pStronghold);
            });
        });
    });
});
