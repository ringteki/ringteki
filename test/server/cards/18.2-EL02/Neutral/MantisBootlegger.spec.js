describe('Mantis Bootlegger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mantis-bootlegger'],
                    hand: ['i-can-swim', 'way-of-the-scorpion'],
                },
                player2: {
                    inPlay: ['mantis-bootlegger'],
                    hand: ['a-fate-worse-than-death', 'way-of-the-crane']
                }
            });

            this.bootlegger1 = this.player1.findCardByName('mantis-bootlegger');
            this.swim = this.player1.findCardByName('i-can-swim');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.bootlegger2 = this.player2.findCardByName('mantis-bootlegger');
            this.afwtd = this.player2.findCardByName('a-fate-worse-than-death');
            this.crane = this.player2.findCardByName('way-of-the-crane');
        });

        it('should react to declaring as an attacker and prompt you to discard a card and let opponent also discard one', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bootlegger1],
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.bootlegger1);
            this.player1.clickCard(this.bootlegger1);
            this.player1.clickCard(this.scorpion);
            expect(this.player2).toHavePrompt('Discard a card?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
            this.player2.clickPrompt('Yes');
            this.player2.clickCard(this.crane);

            expect(this.getChatLogs(8)).toContain('player2 chooses to discard Way of the Crane');
            expect(this.getChatLogs(8)).toContain('player1 uses Mantis Bootlegger, discarding Way of the Scorpion to give the winner of the conflict 2 fate');
        });

        it('should react to declaring as a defender', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bootlegger1],
            });
            this.player1.clickCard(this.bootlegger1);
            this.player1.clickCard(this.scorpion);
            expect(this.player2).toHavePrompt('Discard a card?');
            expect(this.player2).toHavePromptButton('Yes');
            expect(this.player2).toHavePromptButton('No');
            this.player2.clickPrompt('Yes');
            this.player2.clickCard(this.crane);

            this.player2.clickCard(this.bootlegger2);
            this.player2.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.bootlegger2);
            this.player2.clickCard(this.bootlegger2);
            this.player2.clickCard(this.afwtd);
            expect(this.player1).toHavePrompt('Discard a card?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');
            this.player1.clickPrompt('No');

            expect(this.getChatLogs(8)).toContain('player2 uses Mantis Bootlegger, discarding A Fate Worse Than Death to give the winner of the conflict 1 fate');
        });

        it('should give the winner all the fate - player1', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bootlegger1],
            });
            this.player1.clickCard(this.bootlegger1);
            this.player1.clickCard(this.scorpion);
            this.player2.clickPrompt('Yes');
            this.player2.clickCard(this.crane);

            this.player2.clickCard(this.bootlegger2);
            this.player2.clickPrompt('Done');

            this.player2.clickCard(this.bootlegger2);
            this.player2.clickCard(this.afwtd);
            this.player1.clickPrompt('No');

            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.noMoreActions();
            expect(this.player1.fate).toBe(fate + 3);
            expect(this.player2.fate).toBe(fate2);

            expect(this.getChatLogs(8)).toContain('player1 gains 2 fate due to the effect of Mantis Bootlegger');
            expect(this.getChatLogs(8)).toContain('player1 gains 1 fate due to the effect of Mantis Bootlegger');
        });

        it('should give the winner all the fate - player1', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.bootlegger1],
            });
            this.player1.clickCard(this.bootlegger1);
            this.player1.clickCard(this.scorpion);
            this.player2.clickPrompt('Yes');
            this.player2.clickCard(this.crane);

            this.player2.clickCard(this.bootlegger2);
            this.player2.clickPrompt('Done');

            this.player2.clickCard(this.bootlegger2);
            this.player2.clickCard(this.afwtd);
            this.player1.clickPrompt('No');

            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.bootlegger1.bow();

            this.noMoreActions();
            expect(this.player1.fate).toBe(fate);
            expect(this.player2.fate).toBe(fate2 + 3);

            expect(this.getChatLogs(8)).toContain('player2 gains 2 fate due to the effect of Mantis Bootlegger');
            expect(this.getChatLogs(8)).toContain('player2 gains 1 fate due to the effect of Mantis Bootlegger');
        });
    });
});
