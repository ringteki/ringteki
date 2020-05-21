describe('Skirmish Conflict Phase', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['eager-scout']
                },
                player2: {
                    inPlay: ['matsu-tsuko-2']
                },
                skirmish: true
            });

            this.scout = this.player1.findCardByName('eager-scout');
            this.tsuko = this.player2.findCardByName('matsu-tsuko-2');

            this.province = this.player2.player.getProvinceCardInProvince('province 1');
        });

        it('each player should only have 1 conflict opportunity and it should be of either type', function () {
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
            expect(this.player1.player.getConflictOpportunities('political')).toBe(1);

            expect(this.player2.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getConflictOpportunities('military')).toBe(1);
            expect(this.player2.player.getConflictOpportunities('political')).toBe(1);
        });

        it('imperial favor should count skill for both', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            expect(this.getChatLogs(5)).toContain('hi');
        });
    });
});
