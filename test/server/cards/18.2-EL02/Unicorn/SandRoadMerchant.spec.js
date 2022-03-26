describe('Sand Road Merchant', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['border-rider', 'sand-road-merchant'],
                    hand: ['challenge-on-the-fields', 'let-go']
                },
                player2: {
                    honor: 10,
                    inPlay: ['eloquent-advocate', 'kakita-yoshi'],
                    hand: ['policy-debate', 'ornate-fan']
                }
            });

            this.merchant = this.player1.findCardByName('sand-road-merchant');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.advocate = this.player2.findCardByName('eloquent-advocate');
            this.policyDebate = this.player2.findCardByName('policy-debate');
            this.fan = this.player2.findCardByName('ornate-fan');

            this.borderRider = this.player1.findCardByName('border-rider');
            this.challenge = this.player1.findCardByName('challenge-on-the-fields');

            this.player2.reduceDeckToNumber('conflict deck', 0);
            this.player2.moveCard(this.policyDebate, 'conflict deck');
            this.player2.moveCard(this.fan, 'conflict deck');
        });

        it('should react to declaring as an attacker and take a card', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.merchant],
                type: 'political'
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.merchant);
            this.player1.clickCard(this.merchant);

            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Policy Debate');
            expect(this.player1).toHavePromptButton('Ornate Fan');
            expect(this.policyDebate.location).toBe('conflict deck');
            this.player1.clickPrompt('Policy Debate');
            expect(this.policyDebate.location).toBe(this.merchant.uuid);
            expect(this.player1.player.conflictDeck.last()).not.toBe(this.fan);
            expect(this.player2.player.conflictDeck.last()).toBe(this.fan);
            expect(this.getChatLogs(5)).toContain('player1 uses Sand Road Merchant to look at the top two cards of their opponent\'s conflict deck');
            expect(this.getChatLogs(5)).toContain('player1 takes Policy Debate');
            expect(this.getChatLogs(5)).toContain('player2 puts 1 card on the bottom of their conflict deck');

            this.player2.clickCard(this.yoshi);
            this.player2.clickPrompt('Done');

            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            expect(this.player1).toHavePrompt('Policy Debate');
        });

        it('should let you play the card but not let opponent play it', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.merchant],
                type: 'political'
            });

            this.player1.clickCard(this.merchant);
            this.player1.clickPrompt('Policy Debate');
            this.player2.clickCard(this.yoshi);
            this.player2.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.policyDebate);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.pass();
            this.player1.clickCard(this.policyDebate);
            expect(this.player1).toHavePrompt('Policy Debate');

            this.player1.clickCard(this.merchant);
            this.player1.clickCard(this.yoshi);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player2.clickPrompt('Let Go');
            expect(this.policyDebate.location).toBe('conflict discard pile');
            expect(this.player2.player.conflictDiscardPile.toArray()).toContain(this.policyDebate);
            expect(this.player1.player.conflictDiscardPile.toArray()).not.toContain(this.policyDebate);
        });

        it('should react to declaring as a defender', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.merchant],
                type: 'political'
            });

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.merchant);
        });
    });
});
