describe('Skirmish Draw Bidding', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: []
                },
                player2: {
                    inPlay: []
                },
                skirmish: true
            });
        });

        it('should only be able to bid 1 through 3', function() {
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            expect(this.player1).not.toHavePromptButton('5');

            expect(this.player2).toHavePromptButton('1');
            expect(this.player2).toHavePromptButton('2');
            expect(this.player2).toHavePromptButton('3');
            expect(this.player2).not.toHavePromptButton('4');
            expect(this.player2).not.toHavePromptButton('5');
        });
    });
});

describe('Skirmish Dueling', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['policy-debate']
                },
                player2: {
                    inPlay: ['callow-delegate']
                },
                skirmish: true
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.callow = this.player2.findCardByName('callow-delegate');
            this.policyDebate = this.player1.findCardByName('policy-debate');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.callow]
            });

            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.callow);
        });

        it('should only be able to bid 1 through 3', function() {
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            expect(this.player1).not.toHavePromptButton('5');

            expect(this.player2).toHavePromptButton('1');
            expect(this.player2).toHavePromptButton('2');
            expect(this.player2).toHavePromptButton('3');
            expect(this.player2).not.toHavePromptButton('4');
            expect(this.player2).not.toHavePromptButton('5');
        });

        it('should use dial + 1 for the higher character rather than base skill', function() {
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(5)).toContain('Kakita Yoshi: 2 vs 1: Callow Delegate');
        });
    });
});

describe('Skirmish Win Conditions', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['policy-debate']
                },
                player2: {
                    inPlay: ['callow-delegate']
                },
                skirmish: true
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.callow = this.player2.findCardByName('callow-delegate');
            this.policyDebate = this.player1.findCardByName('policy-debate');
            this.province = this.player2.findCardByName('skirmish-province-0', 'province 1');

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.yoshi],
                defenders: [this.callow],
                province: this.province
            });

            this.player2.pass();
        });

        it('honor win is at 12', function() {
            this.player1.honor = 11;
            this.player2.honor = 6;

            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.callow);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');

            expect(this.getChatLogs(5)).toContain('player1 has won the game');
        });

        it('dishonor win is at 0', function() {
            this.player1.honor = 6;
            this.player2.honor = 2;

            this.player1.clickCard(this.policyDebate);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.callow);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('3');

            expect(this.getChatLogs(5)).toContain('player1 has won the game');
        });

        it('conquest win is at 3rd break - not the 3rd break', function() {
            this.player1.pass();
            expect(this.getChatLogs(5)).not.toContain('player1 has won the game');
        });

        it('conquest win is at 3rd break - not the 3rd break', function() {
            this.player2.player.getProvinceCardInProvince('province 2').isBroken = true;
            this.player2.player.getProvinceCardInProvince('province 3').isBroken = true;
            this.player1.pass();
            expect(this.getChatLogs(5)).toContain('player1 has won the game');
        });
    });
});

describe('Skirmish Mode Disabled Cards', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: [],
                    dynastyDiscard: ['kaiu-shihobu']
                },
                player2: {
                    inPlay: []
                },
                skirmish: true
            });

            this.kaiuShihobu = this.player1.placeCardInProvince('kaiu-shihobu', 'province 1');
        });

        it('Kaiu Shihobu', function() {
            this.player1.clickCard(this.kaiuShihobu);
            this.player1.clickPrompt('0');
            expect(this.player1).not.toBeAbleToSelect(this.kaiuShihobu);
        });
    });
});
