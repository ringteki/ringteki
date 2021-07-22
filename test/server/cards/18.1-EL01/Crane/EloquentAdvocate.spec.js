describe('Eloquent Advocate', function() {
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
                    inPlay: ['generic-dynasty-character', 'kakita-yoshi'],
                    hand: ['policy-debate', 'ornate-fan']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.advocate = this.player2.findCardByName('generic-dynasty-character');
            this.policyDebate = this.player2.findCardByName('policy-debate');
            this.fan = this.player2.findCardByName('ornate-fan');

            this.borderRider = this.player1.findCardByName('border-rider');
            this.challenge = this.player1.findCardByName('challenge-on-the-fields');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderRider],
                defenders: [this.yoshi]
            });
        });

        it('should react to a duel initiating', function() {
            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.advocate);
            this.player2.clickCard(this.advocate);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).toBeAbleToSelect(this.borderRider);
        });

        it('should give a pol bonus until the end of the duel', function() {
            let yoshiSkill = this.yoshi.getPoliticalSkill();
            let advocateSkill = this.advocate.getPoliticalSkill();

            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            this.player2.clickCard(this.advocate);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.getPoliticalSkill()).toBe(yoshiSkill + advocateSkill);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.player2.clickPrompt('Challenge on the Fields');
            expect(this.yoshi.getPoliticalSkill()).toBe(yoshiSkill);
        });

        it('should take into account attachments', function() {
            let yoshiSkill = this.yoshi.getPoliticalSkill();
            let advocateSkill = this.advocate.getPoliticalSkill();

            this.player2.playAttachment(this.fan, this.advocate);
            this.player1.pass();

            let advocateSkillFan = this.advocate.getPoliticalSkill();

            this.player2.clickCard(this.policyDebate);
            this.player2.clickCard(this.yoshi);
            this.player2.clickCard(this.borderRider);
            this.player2.clickCard(this.advocate);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.getPoliticalSkill()).not.toBe(yoshiSkill + advocateSkill);
            expect(this.yoshi.getPoliticalSkill()).toBe(yoshiSkill + advocateSkillFan);
            expect(this.getChatLogs(5)).toContain('player2 uses Eloquent Advocate to give Kakita Yoshi +4political until the end of the duel');
        });

        it('should not react in mil duels', function() {
            this.player2.pass();
            this.player1.clickCard(this.challenge);
            this.player1.clickCard(this.borderRider);
            this.player1.clickCard(this.yoshi);
            expect(this.player1).toHavePrompt('Honor Bid');
        });
    });
});
