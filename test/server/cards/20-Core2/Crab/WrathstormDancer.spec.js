describe('Wrathstorm Dancer', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wrathstorm-dancer', 'hida-yakamo', 'bayushi-manipulator']
                },
                player2: {
                }
            });

            this.dancer = this.player1.findCardByName('wrathstorm-dancer');
            this.yakamo = this.player1.findCardByName('hida-yakamo');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
        });


        it('does not bow as a result of conflict resolution if player has another berserker participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer, this.yakamo],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(false);
        });

        it('bows as a result of conflict resolution if player has another berserker participating', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dancer],
                defenders: []
            });
            this.noMoreActions();
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dancer.bowed).toBe(true);
        });
    });
});
