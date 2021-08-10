describe('In Lady Dojis Service', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-whisperer', 'doji-diplomat', 'brash-samurai', 'kakita-yoshi'],
                    hand: ['in-lady-doji-s-service', 'i-can-swim', 'game-of-sadane']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kakita-asami']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.asami = this.player2.findCardByName('kakita-asami');
            this.service = this.player1.findCardByName('in-lady-doji-s-service');
            this.swim = this.player1.findCardByName('i-can-swim');
            this.sadane = this.player1.findCardByName('game-of-sadane');
        });

        it('should reduce the cost to play events by 1', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.asami]
            });

            this.player2.pass();
            this.player1.clickCard(this.service);
            this.player2.pass();

            expect(this.getChatLogs(5)).toContain('player1 plays In Lady Dōji\'s Service to reduce the cost of events this conflict');

            let fate = this.player1.fate;
            this.player1.clickCard(this.sadane);
            this.player1.clickCard(this.yoshi);
            this.player1.clickCard(this.asami);
            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');

            expect(this.player1.fate).toBe(fate);
            expect(this.asami.isDishonored).toBe(true);
            this.player2.pass();
            this.player1.clickCard(this.swim);
            this.player1.clickCard(this.asami);

            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should not be playable if you don\'t control a participating character', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.asami],
                defenders: []
            });

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.service);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
