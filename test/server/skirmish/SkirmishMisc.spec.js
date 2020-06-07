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
        describe('Kaiu Shihobu', function() {
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

            it('Should not trigger', function() {
                this.player1.clickCard(this.kaiuShihobu);
                this.player1.clickPrompt('0');
                expect(this.player1).not.toBeAbleToSelect(this.kaiuShihobu);
            });
        });

        describe('Wealth of the Crane', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [],
                        dynastyDiscard: ['doji-whisperer', 'kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai', 'favorable-ground',
                            'imperial-storehouse', 'iron-mine', 'a-season-of-war', 'dispatch-to-nowhere', 'aranat'],
                        hand: ['the-wealth-of-the-crane']
                    },
                    player2: {
                        inPlay: []
                    },
                    skirmish: true
                });

                this.player1.reduceDeckToNumber('dynasty deck', 0);

                this.wealth = this.player1.findCardByName('the-wealth-of-the-crane');

                this.dojiWhisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');
                this.yoshi = this.player1.moveCard('kakita-yoshi', 'dynasty deck');
                this.toshimoko = this.player1.moveCard('kakita-toshimoko', 'dynasty deck');
                this.kageyu = this.player1.moveCard('daidoji-kageyu', 'dynasty deck');
                this.chagatai = this.player1.moveCard('moto-chagatai', 'dynasty deck');

                this.favorable = this.player1.moveCard('favorable-ground', 'dynasty deck');
                this.storehouse = this.player1.moveCard('imperial-storehouse', 'dynasty deck');
                this.mine = this.player1.moveCard('iron-mine', 'dynasty deck');
                this.season = this.player1.moveCard('a-season-of-war', 'dynasty deck');
                this.dispatch = this.player1.moveCard('dispatch-to-nowhere', 'dynasty deck');
                this.aranat = this.player1.moveCard('aranat', 'dynasty deck');
            });

            it('should only prompt you for 3 cards and then stop prompting you', function() {
                this.player1.clickCard(this.wealth);
                expect(this.player1).toHavePrompt('The Wealth of the Crane');
                expect(this.player1).toHavePrompt('Choose a card to put into Skirmish Province');
                expect(this.player1).not.toHavePromptButton('Doji Whisperer');
                this.player1.clickPrompt('Kakita Yoshi');
                this.player1.clickPrompt('Daidoji Kageyu');
                this.player1.clickPrompt('Iron Mine');
                expect(this.player2).toHavePrompt('Action Window');
            });
        });

        describe('Governor\'s Spy', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['governor-s-spy'],
                        dynastyDiscard: ['doji-whisperer', 'doji-challenger', 'doji-kuwanan', 'daidoji-uji', 'kakita-toshimoko', 'kakita-yuri']
                    },
                    player2: {
                    },
                    skirmish: true
                });

                this.spy = this.player1.findCardByName('governor-s-spy');

                this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
                this.challenger = this.player1.placeCardInProvince('doji-challenger', 'province 2');
                this.kuwanan = this.player1.placeCardInProvince('doji-kuwanan', 'province 3');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.yuri = this.player1.findCardByName('kakita-yuri');

                this.p1_1 = this.player1.findCardByName('skirmish-province-0', 'province 1');
                this.p1_2 = this.player1.findCardByName('skirmish-province-1', 'province 2');
                this.p1_3 = this.player1.findCardByName('skirmish-province-2', 'province 3');
            });

            it('should prompt you to put each card into a province, letting you double up if possible', function() {
                this.noMoreActions();

                this.player1.moveCard(this.yuri, 'province 1');

                this.initiateConflict({
                    attackers: [this.spy],
                    defenders: [],
                    type: 'political'
                });

                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.spy);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('player1');
                expect(this.player1).toHavePromptButton('player2');
                this.player1.clickPrompt('player1');

                this.player1.clickPrompt('Doji Whisperer');
                expect(this.player1).toHavePrompt('Choose a province for Doji Whisperer');
                expect(this.player1).toBeAbleToSelect(this.p1_1);
                expect(this.player1).toBeAbleToSelect(this.p1_2);
                expect(this.player1).toBeAbleToSelect(this.p1_3);

                this.player1.clickCard(this.p1_1);
                expect(this.getChatLogs(1)).toContain('player1 places a card');

                this.player1.clickPrompt('Kakita Yuri');
                expect(this.player1).toHavePrompt('Choose a province for Kakita Yuri');
                expect(this.player1).toBeAbleToSelect(this.p1_1);
                expect(this.player1).toBeAbleToSelect(this.p1_2);
                expect(this.player1).toBeAbleToSelect(this.p1_3);

                this.player1.clickCard(this.p1_1);
                expect(this.getChatLogs(1)).toContain('player1 places a card');

                this.player1.clickPrompt('Doji Challenger');
                expect(this.player1).toHavePrompt('Choose a province for Doji Challenger');
                expect(this.player1).not.toBeAbleToSelect(this.p1_1);
                expect(this.player1).toBeAbleToSelect(this.p1_2);
                expect(this.player1).toBeAbleToSelect(this.p1_3);

                this.player1.clickCard(this.p1_3);
                expect(this.getChatLogs(1)).toContain('player1 places a card');

                this.player1.clickPrompt('Doji Kuwanan');
                expect(this.player1).toHavePrompt('Choose a province for Doji Kuwanan');
                expect(this.player1).not.toBeAbleToSelect(this.p1_1);
                expect(this.player1).toBeAbleToSelect(this.p1_2);
                expect(this.player1).not.toBeAbleToSelect(this.p1_3);

                this.player1.clickCard(this.p1_2);
                expect(this.getChatLogs(4)).toContain('player1 places a card');
                expect(this.getChatLogs(5)).toContain('player1 has finished placing cards');

                expect(this.whisperer.location).toBe('province 1');
                expect(this.yuri.location).toBe('province 1');
                expect(this.challenger.location).toBe('province 3');
                expect(this.kuwanan.location).toBe('province 2');
            });
        });
    });
});
