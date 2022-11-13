describe('Kitsuki Seiji', function () {
    integration(function () {
        describe('Static ability for variable skill', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-seiji'],
                        hand: ['game-of-sadane']
                    },
                    player2: {
                        inPlay: ['shiba-tsukune']
                    }
                });
                this.seiji = this.player1.findCardByName('kitsuki-seiji');
                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.gameOfSadane =
                    this.player1.findCardByName('game-of-sadane');
            });

            describe('When the bid is odd', function () {
                beforeEach(function () {
                    this.player1.player.showBid = 1;
                    this.noMoreActions();
                });

                it('gets +2/-2', function () {
                    expect(this.seiji.militarySkill).toBe(5);
                    expect(this.seiji.politicalSkill).toBe(1);
                });
            });

            describe('When the bid is even', function () {
                beforeEach(function () {
                    this.player1.player.showBid = 2;
                    this.noMoreActions();
                });

                it('gets -2/+2', function () {
                    expect(this.seiji.militarySkill).toBe(1);
                    expect(this.seiji.politicalSkill).toBe(5);
                });
            });

            describe('Affects duels', function () {
                beforeEach(function () {
                    this.player1.player.showBid = 1;
                    this.noMoreActions();
                    this.initiateConflict({
                        ring: 'void',
                        attackers: [this.seiji],
                        defenders: [this.tsukune]
                    });
                    this.player2.pass();
                });

                it('the skill modifiers affect duels', function () {
                    expect(this.seiji.militarySkill).toBe(5);
                    expect(this.seiji.politicalSkill).toBe(1);

                    this.player1.clickCard(this.gameOfSadane);
                    this.player1.clickCard(this.seiji);
                    this.player1.clickCard(this.tsukune);
                    this.player1.clickPrompt('2');
                    this.player2.clickPrompt('2');

                    expect(this.seiji.isHonored).toBe(true);
                    expect(this.tsukune.isDishonored).toBe(true);
                });
            });
        });

        describe('Reaction ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kitsuki-seiji']
                    },
                    player2: {
                        inPlay: ['shiba-tsukune']
                    }
                });
                this.seiji = this.player1.findCardByName('kitsuki-seiji');
                this.tsukune = this.player2.findCardByName('shiba-tsukune');
                this.noMoreActions();
            });

            it('should trigger when the player claims the water ring', function () {
                this.initiateConflict({
                    type: 'military',
                    ring: 'water',
                    attackers: [this.seiji],
                    defenders: [this.tsukune],
                    jumpTo: 'afterConflict'
                });
                this.player1.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.seiji);
                this.player1.clickCard(this.seiji);
                expect(this.seiji.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Kitsuki Seiji to place 1 fate on Kitsuki Seiji'
                );
            });

            it('should trigger when another player claims the water ring', function () {
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    ring: 'water',
                    attackers: [this.tsukune],
                    defenders: [],
                    jumpTo: 'afterConflict'
                });
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Don\'t resolve');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.seiji);
                this.player1.clickCard(this.seiji);
                expect(this.seiji.fate).toBe(1);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Kitsuki Seiji to place 1 fate on Kitsuki Seiji'
                );
            });
        });
    });
});
