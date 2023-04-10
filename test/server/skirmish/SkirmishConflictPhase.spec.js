const { GameModes } = require('../../../build/server/GameModes');

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
                gameMode: GameModes.Skirmish
            });

            this.scout = this.player1.findCardByName('eager-scout');
            this.tsuko = this.player2.findCardByName('matsu-tsuko-2');
        });

        it('each player should only have 1 conflict opportunity and it should be of either type', function () {
            expect(this.player1.player.getConflictOpportunities()).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(1);

            expect(this.player2.player.getConflictOpportunities()).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(1);
        });

        it('imperial favor should count skill for both - testing mil with favor', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a military conflict at Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 1');
        });

        it('imperial favor should count skill for both - testing mil without favor', function () {
            this.player1.player.imperialFavor = '';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a military conflict at Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 0');
        });

        it('imperial favor should count skill for both - testing pol', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a political conflict at Skirmish Province, contesting Air Ring');
            expect(this.getChatLogs(5)).toContain('player1 has initiated a political conflict with skill 1');
        });

        it('imperial favor should count skill for both - testing pol without favor', function () {
            this.player1.player.imperialFavor = '';
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 is initiating a political conflict at Skirmish Province, contesting Air Ring');
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
                defenders: []
            });

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);
            expect(this.getChatLogs(3)).toContain('player1 has won an unopposed conflict');
        });

        it('Claiming Favor - should just claim a neutral favor', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            expect(this.getChatLogs(5)).toContain('player2 claims the Emperor\'s favor!');
            expect(this.player2.player.imperialFavor).toBe('both');
        });
    });
});

describe('Normal Conflict Phase', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['eager-scout']
                },
                player2: {
                    inPlay: ['matsu-tsuko-2']
                }
            });

            this.scout = this.player1.findCardByName('eager-scout');
            this.tsuko = this.player2.findCardByName('matsu-tsuko-2');
        });

        it('each player should have 2 conflict opportunities (1 of each type)', function () {
            expect(this.player1.player.getConflictOpportunities()).toBe(2);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player1.player.getRemainingConflictOpportunitiesForType('political')).toBe(1);

            expect(this.player2.player.getConflictOpportunities()).toBe(2);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(1);
            expect(this.player2.player.getRemainingConflictOpportunitiesForType('political')).toBe(1);
        });

        it('imperial favor should not count skill for both - testing mil with pol favor', function () {
            this.player1.player.imperialFavor = 'political';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 0');
        });

        it('imperial favor should count skill for both - testing pol with mil favor', function () {
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.scout],
                defenders: []
            });

            expect(this.getChatLogs(5)).toContain('player1 has initiated a political conflict with skill 0');
        });

        it('should cause unopposed honor loss', function () {
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: []
            });

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2 - 1);
            expect(this.getChatLogs(3)).toContain('player2 loses 1 honor for not defending the conflict');
        });

        it('Claiming Favor - should prompt you to pick', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.player2.passConflict();
            this.noMoreActions();
            expect(this.player2).toHavePrompt('Which side of the Imperial Favor would you like to claim?');
        });
    });
});
