describe('Crystal Cave', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    stronghold: ['crab-box'],
                    provinces: ['manicured-garden']
                },
                player2: {
                    provinces: ['untamed-steppe']
                }
            });

            this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');
            this.manicuredGarden.facedown = false;
            this.untamedSteppe = this.player2.findCardByName('untamed-steppe', 'province 1');
            this.untamedSteppe.facedown = false;
        });

        it('gives strength bonus to your provinces', function () {
            expect(this.manicuredGarden.strength).toBe(5);
        });
        it('does not give strength bonus to enemy provinces', function () {
            expect(this.untamedSteppe.strength).toBe(6);
        });
    });
});
