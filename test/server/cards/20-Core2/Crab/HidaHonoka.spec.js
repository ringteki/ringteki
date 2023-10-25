describe('Hida Honoka', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-honoka', 'smuggling-deal'],
                    stronghold: ['kyuden-hida'],
                    provinces: [
                        'manicured-garden',
                        'city-of-the-rich-frog',
                        'upholding-authority',
                        'magistrate-station'
                    ]
                }
            });

            this.hidaHonoka = this.player1.findCardByName('hida-honoka');
            this.smugglingDeal = this.player1.findCardByName('smuggling-deal');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.richFrog = this.player1.findCardByName('city-of-the-rich-frog');
            this.upholding = this.player1.findCardByName('upholding-authority');
            this.station = this.player1.findCardByName('magistrate-station');

            this.richFrog.isBroken = true;
            this.upholding.isBroken = true;
            this.station.isBroken = true;
        });

        it('restores a province', function () {
            this.player1.clickCard(this.hidaHonoka);
            this.player1.clickCard(this.upholding);
            expect(this.upholding.isBroken).toBe(false);
            expect(this.getChatLogs(1)).toContain('player1 uses Hida Honoka to restore Upholding Authority');
        });

        it('does not work twice', function () {
            this.player1.clickCard(this.hidaHonoka);
            this.player1.clickCard(this.upholding);
            expect(this.upholding.isBroken).toBe(false);
            expect(this.getChatLogs(1)).toContain('player1 uses Hida Honoka to restore Upholding Authority');

            this.player1.clickCard(this.smugglingDeal);
            this.player1.clickCard(this.hidaHonoka);
            this.player1.clickCard(this.station);
            expect(this.getChatLogs(1)).not.toContain('player1 uses Hida Honoka to restore Magistrate Station');
        });
    });
});
