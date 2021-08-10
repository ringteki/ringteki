describe('Sadane Academy', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['border-rider'],
                    hand: ['challenge-on-the-fields']
                },
                player2: {
                    honor: 10,
                    inPlay: ['eloquent-advocate', 'kakita-yoshi'],
                    hand: ['policy-debate', 'ornate-fan'],
                    provinces: ['generic-province']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.advocate = this.player2.findCardByName('eloquent-advocate');
            this.policyDebate = this.player2.findCardByName('policy-debate');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.academy = this.player2.findCardByName('generic-province');
            this.sd = this.player2.findCardByName('shameful-display', 'province 2');

            this.borderRider = this.player1.findCardByName('border-rider');
            this.challenge = this.player1.findCardByName('challenge-on-the-fields');
        });

        it('should react to a duel initiating', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi],
                province: this.academy
            });

            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.academy);
            this.player2.clickCard(this.academy);
            
            expect(this.getChatLogs(5)).toContain('player2 uses A Generic Province to win the duel originating from Policy Debate');
        });

        it('should give a pol bonus until the end of the duel', function() {
            let yoshiSkill = this.yoshi.getPoliticalSkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi],
                province: this.academy
            });

            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            this.player2.clickCard(this.academy);

            expect(this.player2).not.toHavePrompt('Honor Bid');
            expect(this.player2).toHavePrompt('Policy Debate');
            this.player2.clickPrompt('Challenge on the Fields');
        });

        it('should not react in mil duels', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi],
                province: this.academy
            });

            this.player2.pass();
            this.player1.clickCard(this.challenge);
            this.player1.clickCard(this.borderRider);
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Honor Bid');
        });

        it('should not react at other provinces', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi],
                province: this.sd
            });

            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).not.toBeAbleToSelect(this.academy);
            expect(this.player2).toHavePrompt('Honor Bid');
        });
    });
});