const CARD_UNDER_TEST = 'bayushi-shoj-2';
describe('Bayushi Shoju 2', function() {
    integration(function() {
        describe('Bayushi Shoju 2\'s triggered ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        honor: 10,
                        inPlay: [CARD_UNDER_TEST]
                    },
                    player2: {
                        honor: 10
                    }
                });

                this.bayushiShoju = this.player1.findCardByName(CARD_UNDER_TEST);

                // select bid for both players
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should trigger at the start of the conflict phase', function() {
                let p1Hand = this.player1.hand.length;
                let p2Hand = this.player2.hand.length;

                let p1Honor = this.player1.honor;
                let p2Honor = this.player2.honor;

                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                expect(this.player1.honor).toBe(p1Honor - 1);
                expect(this.player2.honor).toBe(p2Honor - 1);
                expect(this.player1.hand.length).toBe(p1Hand + 2);
                expect(this.player2.hand.length).toBe(p2Hand + 2);

                expect(this.getChatLogs(1)).toContain('player1 uses Bayushi Shoj-2 to have each player lose an honor and draw two cards');
            });

            it('should let player 1 win if both are at 1 honor', function() {
                let p1Hand = this.player1.hand.length;
                let p2Hand = this.player2.hand.length;

                this.player1.honor = 1;
                this.player2.honor = 1;

                let p1Honor = this.player1.honor;
                let p2Honor = this.player2.honor;

                this.noMoreActions();
                expect(this.game.currentPhase).toBe('conflict');

                expect(this.player1.honor).toBe(p1Honor - 1);
                expect(this.player2.honor).toBe(p2Honor - 1);
                expect(this.player1.hand.length).toBe(p1Hand + 2);
                expect(this.player2.hand.length).toBe(p2Hand + 2);

                expect(this.getChatLogs(1)).toContain('player1 has won the game');
            });
        });

        describe('Bayushi Shoju 2\'s constant ability (glory count)', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [CARD_UNDER_TEST],
                        hand: ['severed-from-the-stream']
                    },
                    player2: {
                        inPlay: ['doji-diplomat']
                    }
                });

                this.bayushiShoju = this.player1.findCardByName(CARD_UNDER_TEST);
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.stream = this.player1.findCardByName('severed-from-the-stream');
                this.bayushiShoju.bowed = true;
            });

            it('should contribute glory while bowed', function() {
                this.player1.clickCard(this.stream);
                expect(this.getChatLogs(5)).toContain('player1 wins the glory count 3 vs 1');
            });
        });
    });
});
