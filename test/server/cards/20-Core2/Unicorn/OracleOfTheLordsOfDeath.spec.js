xdescribe('Oracle of the Lords of Death', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-youth', 'oracle-of-the-lords-of-death'],
                    hand: ['banzai']
                },
                player2: {
                    hand: ['assassination']
                }
            });

            this.motoYouth = this.player1.findCardByName('moto-youth');
            this.oracle = this.player1.findCardByName('oracle-of-the-lords-of-death');
            this.banzai = this.player1.findCardByName('banzai');

            this.assassination = this.player2.findCardByName('assassination');
        });

        it('absorbs the MIL from a character when they leave play', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoYouth],
                defenders: []
            });

            const oracleInitial = this.oracle.getMilitarySkill();

            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.motoYouth);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.oracle);

            this.player1.clickCard(this.oracle);
            expect(this.oracle.getMilitarySkill()).toBe(oracleInitial + 3);
            expect(this.getChatLogs(3)).toContain('player1 uses Oracle of the Lords of Death to get +3 military');
        });
    });
});
