describe('Crane Industry', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger'],
                    hand: ['crane-industry', 'admit-defeat', 'i-can-swim', 'way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['a-fate-worse-than-death']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.industry = this.player1.findCardByName('crane-industry');
            this.defeat = this.player1.findCardByName('admit-defeat');
            this.swim = this.player1.findCardByName('i-can-swim');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.afwtd = this.player2.findCardByName('a-fate-worse-than-death');
        });

        it('should react to the conflict starting', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.industry);
        });

        it('should prompt you to pay a fate and an honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            expect(this.player1).toHavePrompt('Spend 1 fate?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Give your opponent 1 honor to draw a card?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
        });

        it('should draw if you pay an honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;
            let hand = this.player1.hand.length;

            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('Yes');
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.player2.honor).toBe(honor2 + 1);
            expect(this.player1.hand.length).toBe(hand);

            expect(this.getChatLogs(5)).toContain('player1 chooses to give player2 an honor and draw a card');
        });

        it('should not draw if you don\'t pay an honor', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;
            let hand = this.player1.hand.length;

            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('No');
            expect(this.player1.honor).toBe(honor);
            expect(this.player2.honor).toBe(honor2);
            expect(this.player1.hand.length).toBe(hand - 1);

            expect(this.getChatLogs(5)).toContain('player1 chooses not to give player2 an honor and draw a card');
        });

        it('should reduce costs for both players if you don\'t pay a fate', function() {
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');
            expect(this.getChatLogs(5)).toContain('player1 plays Crane Industry to reduce the cost of events each player plays this conflict by 1');

            let fate = this.player2.fate;
            this.player2.clickCard(this.afwtd);
            this.player2.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 3);

            fate = this.player1.fate;
            this.player1.clickCard(this.scorpion);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.defeat);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.swim);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should only reduce costs for you players if you pay a fate', function() {
            this.player1.player.showBid = 5;
            this.player2.player.showBid = 1;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('Yes');
            this.player1.clickPrompt('No');
            expect(this.getChatLogs(5)).toContain('player1 plays Crane Industry, paying 1 fate to reduce the cost of events they play this conflict by 1');

            let fate = this.player2.fate;
            this.player2.clickCard(this.afwtd);
            this.player2.clickCard(this.challenger);
            expect(this.player2.fate).toBe(fate - 4);

            fate = this.player1.fate;
            this.player1.clickCard(this.scorpion);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.defeat);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate);
            this.player2.pass();
            this.player1.clickCard(this.swim);
            this.player1.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should cost 1 as attacker', function() {
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.whisperer]
            });
            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');

            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should cost 0 as defender', function() {
            let fate = this.player1.fate;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: [this.challenger]
            });
            this.player1.clickCard(this.industry);
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('No');

            expect(this.player1.fate).toBe(fate);
        });
    });
});
