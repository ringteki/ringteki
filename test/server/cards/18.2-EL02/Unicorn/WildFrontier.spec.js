describe('Wild Frontier', function() {
    integration(function() {
        describe('Wild Frontier\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['moto-youth'],
                        provinces: ['fertile-fields', 'meditations-on-the-tao'],
                        hand: ['fine-katana','ornate-fan']
                    },
                    player2: {
                        provinces: ['sacred-sanctuary', 'wild-frontier', 'shameful-display']
                    }
                });

                this.katana = this.player1.findCardByName('fine-katana');
                this.fertileFields = this.player1.findCardByName('fertile-fields');
                this.meditiations = this.player1.findCardByName('meditations-on-the-tao');
                this.motoYouth = this.player1.findCardByName('moto-youth');
                this.fertileFields.facedown = false;

                this.sanctuary = this.player2.findCardByName('sacred-sanctuary');
                this.frontier = this.player2.findCardByName('wild-frontier');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display');
                this.stronghold = this.player2.findCardByName('shameful-display', 'stronghold province');
                this.sanctuary.facedown = false;
                this.frontier.facedown = false;
                this.stronghold.facedown = false;
                this.shamefulDisplay.facedown = false;
                this.shamefulDisplay.isBroken = true;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.motoYouth],
                    defenders: [],
                    province: this.frontier
                });
            });

            it('should only target another faceup province unbroken province', function() {
                this.player2.clickCard(this.frontier);
                expect(this.player2).toHavePrompt('Choose a province');
                expect(this.player2).toBeAbleToSelect(this.sanctuary);
                expect(this.player2).toBeAbleToSelect(this.fertileFields);
                expect(this.player2).not.toBeAbleToSelect(this.frontier);
                expect(this.player2).not.toBeAbleToSelect(this.shamefulDisplay);
                expect(this.player2).not.toBeAbleToSelect(this.stronghold);
            });

            it('should turn the province face down', function() {
                this.player2.clickCard(this.frontier);
                this.player2.clickCard(this.sanctuary);
                expect(this.sanctuary.facedown).toBe(true);
            });
        });
    });
});
