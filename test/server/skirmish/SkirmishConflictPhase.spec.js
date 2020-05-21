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

            this.province = this.player2.findCardByName('skirmish-province', 'province 1');
        });

        it('each player should only have 1 conflict opportunity and it should be of either type', function () {
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player1.player.getConflictOpportunities('military')).toBe(1);
            expect(this.player1.player.getConflictOpportunities('political')).toBe(1);

            expect(this.player2.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getConflictOpportunities('military')).toBe(1);
            expect(this.player2.player.getConflictOpportunities('political')).toBe(1);
        });

        it('imperial favor should count skill for both - testing mil with favor', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a military conflict at a Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 1');
        });

        it('imperial favor should count skill for both - testing mil without favor', function () {
            this.player1.player.imperialFavor = '';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a military conflict at a Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 0');
        });

        it('imperial favor should count skill for both - testing pol', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a political conflict at a Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a political conflict with skill 1');
        });

        it('imperial favor should count skill for both - testing pol without favor', function () {
            this.player1.player.imperialFavor = '';
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a political conflict at a Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a political conflict with skill 0');
        });

        it('no unopposed honor loss', function () {
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                province: this.province
            });

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor);
            expect(this.getChatLogs(3)).toContain('player1 has won an unopposed conflict');
        });
    });
});
