describe('Favorable Ground', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-manipulator']
                },
                player2: {
                    dynastyDiscard: ['integrated-watchtower'],
                    inPlay: ['adept-of-the-waves', 'asako-diplomat', 'naive-student']
                }
            });
            this.bayushiManipulatorr = this.player1.findCardByName('bayushi-manipulator');

            this.integratedWatchtower = this.player2.placeCardInProvince('integrated-watchtower', 'province 1');
            this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
            this.asakoDiplomat = this.player2.findCardByName('asako-diplomat');
            this.naiveStudent = this.player2.findCardByName('naive-student');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.bayushiManipulatorr],
                defenders: []
            });
            this.player2.clickCard(this.integratedWatchtower);
        });

        it('moves a character into the defense', function () {
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.bayushiManipulatorr);
            expect(this.player2).not.toBeAbleToSelect(this.naiveStudent);
            expect(this.player2).toBeAbleToSelect(this.asakoDiplomat);

            this.player2.clickCard(this.asakoDiplomat);
            expect(this.asakoDiplomat.inConflict).toBe(true);
        });
    });
});
