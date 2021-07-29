describe('Mirumoto\'s Peak', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                    hand: ['fine-katana', 'pathfinder-s-blade', 'inscribed-tanto', 'scarlet-sabre', 'ornate-fan', 'spell-scroll', 'storm-of-steel']
                },
                player2: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['noble-sacrifice']
                }
            });

            this.steel = this.player1.findCardByName('storm-of-steel');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.sac = this.player2.findCardByName('noble-sacrifice');

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');

            this.katana = this.player1.findCardByName('fine-katana');
            this.pfb = this.player1.findCardByName('pathfinder-s-blade');
            this.tanto = this.player1.findCardByName('inscribed-tanto');
            this.sabre = this.player1.findCardByName('scarlet-sabre');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.scroll = this.player1.findCardByName('spell-scroll');

            this.player1.playAttachment(this.fan, this.challenger);
            this.player2.pass();

            this.player1.playAttachment(this.scroll, this.challenger);
            this.player2.pass();

            this.player1.playAttachment(this.katana, this.challenger);
            this.player2.pass();

            this.player1.playAttachment(this.pfb, this.challenger);
            this.player2.pass();

            this.player1.playAttachment(this.tanto, this.challenger);
        });

        it('should prompt you to choose a character then choose weapons attached to them', function() {
            let mil = this.challenger.getMilitarySkill();
            this.pfb.bowed = true;

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger, this.kuwanan],
                defenders: [this.yoshi]
            });
            this.player2.pass();
            this.player1.clickCard(this.steel);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.tanto);
            expect(this.player1).not.toBeAbleToSelect(this.fan);
            expect(this.player1).not.toBeAbleToSelect(this.pfb);
            expect(this.player1).not.toBeAbleToSelect(this.scroll);

            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.tanto);
            this.player1.clickPrompt('Done');

            expect(this.challenger.getMilitarySkill()).toBe(mil + 4);
            expect(this.katana.bowed).toBe(true);
            expect(this.tanto.bowed).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 plays Storm of Steel to bow Fine Katana and Inscribed Tantō and give Doji Challenger +4military');
        });
    });
});
