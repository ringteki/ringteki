describe('Lady Dojis Outpost', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'doji-kuwanan', 'doji-whisperer'],
                    hand: ['resourcefulness'],
                    stronghold: ['lady-doji-s-outpost'],
                    dynastyDiscard: ['favorable-ground']
                },
                player2: {
                    inPlay: ['savvy-politician']
                }
            });

            this.outpost = this.player1.findCardByName('lady-doji-s-outpost');
            this.ground = this.player1.findCardByName('favorable-ground');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.savvy = this.player2.findCardByName('savvy-politician');

            this.player1.placeCardInProvince(this.ground, 'province 1');
        });

        it('should give characters participating alone +1/+1', function() {
            let mil = this.yoshi.getMilitarySkill();
            let pol = this.yoshi.getPoliticalSkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.savvy]
            });

            expect(this.yoshi.getMilitarySkill()).toBe(mil + 1);
            expect(this.yoshi.getPoliticalSkill()).toBe(pol + 1);

            this.player2.pass();
            this.player1.clickCard(this.ground);
            this.player1.clickCard(this.challenger);

            expect(this.yoshi.getMilitarySkill()).toBe(mil);
            expect(this.yoshi.getPoliticalSkill()).toBe(pol);
        });

        it('should dishonor someone to gain 2 fate', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.outpost);
            this.player1.clickCard(this.challenger);

            expect(this.player1.fate).toBe(fate + 2);
            expect(this.challenger.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Lady Dōji\'s Outpost, bowing Lady Dōji\'s Outpost and dishonoring Doji Challenger to gain 2 fate');
        });
    });
});
