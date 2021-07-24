describe('Duel of Haiku', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['border-rider', 'moto-conqueror', 'doji-whisperer']
                },
                player2: {
                    honor: 10,
                    inPlay: ['kakita-yoshi', 'kakita-toshimoko'],
                    hand: ['duel-of-haiku']
                }
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.haiku = this.player2.findCardByName('duel-of-haiku');
            this.borderRider = this.player1.findCardByName('border-rider');
            this.conqueror = this.player1.findCardByName('moto-conqueror');
        });

        it('should honor and then choose whether to a initiate a duel', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi, this.toshimoko]
            });

            this.player2.clickCard(this.haiku);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.borderRider);
            expect(this.player2).not.toBeAbleToSelect(this.whisperer);
            expect(this.player2).not.toBeAbleToSelect(this.toshimoko);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 plays Duel of Haiku to honor Kakita Yoshi');
            expect(this.player2).toHavePromptButton('Do not duel');
            expect(this.player2).toHavePromptButton('Initiate a duel');
        });

        it('choosing not to duel', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi]
            });

            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            this.player2.clickPrompt('Do not duel');
            expect(this.getChatLogs(5)).toContain('player2 chooses not to initiate a duel');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('choosing to duel', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi]
            });

            let hand = this.player2.hand.length;

            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            this.player2.clickPrompt('Initiate a duel');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.borderRider);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.borderRider);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.getChatLogs(10)).toContain('player1 chooses to initiate a duel with Border Rider');
            expect(this.getChatLogs(10)).toContain('Kakita Yoshi: 10 vs 2: Border Rider');
            expect(this.getChatLogs(10)).toContain('Duel Effect: draw 2 cards');
            expect(this.player2.hand.length).toBe(hand + 1); //+2, -1 from the card itself
        });

        it('should not be able to duel if there are no valid duel targets', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conqueror],
                defenders: [this.yoshi]
            });

            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            expect(this.player2).toHavePromptButton('Do not duel');
            expect(this.player2).not.toHavePromptButton('Initiate a duel');
        });

        it('should not be able to duel if there are no participants', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: []
            });

            this.player1.pass();
            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            expect(this.player2).toHavePromptButton('Do not duel');
            expect(this.player2).not.toHavePromptButton('Initiate a duel');
        });

        it('should not be able to duel if outside of a conflict', function() {
            this.player1.pass();
            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            expect(this.player2).not.toHavePromptButton('Do not duel');
            expect(this.player2).not.toHavePromptButton('Initiate a duel');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be able to duel if not participating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.conqueror],
                defenders: [this.toshimoko]
            });

            this.player2.clickCard(this.haiku);
            this.player2.clickCard(this.yoshi);
            expect(this.player2).not.toHavePromptButton('Do not duel');
            expect(this.player2).not.toHavePromptButton('Initiate a duel');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
