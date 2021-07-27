describe('Mirumoto\'s Peak', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                    hand: ['fine-katana', 'pathfinder-s-blade', 'inscribed-tanto', 'scarlet-sabre', 'ornate-fan', 'spell-scroll'],
                    stronghold: ['mirumoto-s-peak']
                },
                player2: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['noble-sacrifice']
                }
            });

            this.peak = this.player1.findCardByName('mirumoto-s-peak');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.sac = this.player2.findCardByName('noble-sacrifice');

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');

            this.challenger.dishonor();
            this.yoshi.honor();

            this.katana = this.player1.findCardByName('fine-katana');
            this.pfb = this.player1.findCardByName('pathfinder-s-blade');
            this.tanto = this.player1.findCardByName('inscribed-tanto');
            this.sabre = this.player1.findCardByName('scarlet-sabre');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.scroll = this.player1.findCardByName('spell-scroll');
            this.game.checkGameState(true);
        });

        it('should give +1/+1 as long as a character has at leaast two weapons', function() {
            let mil = this.challenger.getMilitarySkill();
            let pol = this.challenger.getPoliticalSkill();

            this.player1.playAttachment(this.fan, this.challenger);
            this.player2.pass();
            expect(this.challenger.getMilitarySkill()).toBe(mil);
            expect(this.challenger.getPoliticalSkill()).toBe(pol + 2); //fan

            this.player1.playAttachment(this.scroll, this.challenger);
            this.player2.pass();
            expect(this.challenger.getMilitarySkill()).toBe(mil);
            expect(this.challenger.getPoliticalSkill()).toBe(pol + 2); //fan

            this.player1.playAttachment(this.katana, this.challenger);
            this.player2.pass();
            expect(this.challenger.getMilitarySkill()).toBe(mil + 2);
            expect(this.challenger.getPoliticalSkill()).toBe(pol + 2);

            this.player1.playAttachment(this.pfb, this.challenger);
            this.player2.pass();
            expect(this.challenger.getMilitarySkill()).toBe(mil + 4);
            expect(this.challenger.getPoliticalSkill()).toBe(pol + 3); //fan

            this.player1.playAttachment(this.tanto, this.challenger);
            this.player2.pass();
            expect(this.challenger.getMilitarySkill()).toBe(mil + 5);
            expect(this.challenger.getPoliticalSkill()).toBe(pol + 3); //fan
        });

        it('should give Ancestral to weapons', function() {
            this.player1.playAttachment(this.fan, this.challenger);
            this.player2.pass();
            this.player1.playAttachment(this.scroll, this.challenger);
            this.player2.pass();
            this.player1.playAttachment(this.katana, this.challenger);
            this.player2.pass();
            this.player1.playAttachment(this.pfb, this.challenger);
            this.player2.pass();
            this.player1.playAttachment(this.tanto, this.challenger);
            this.player2.pass();

            this.player1.clickCard(this.peak);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.challenger);
            expect(this.getChatLogs(5)).toContain('player1 uses Mirumoto\'s Peak, bowing Mirumoto\'s Peak to grant ancestral to Doji Challenger\'s weapons (Fine Katana, Pathfinder\'s Blade and Inscribed Tantō)');
            this.player2.clickCard(this.sac);
            this.player2.clickCard(this.challenger);
            this.player2.clickCard(this.yoshi);
            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.scroll.location).toBe('conflict discard pile');

            expect(this.katana.location).toBe('hand');
            expect(this.pfb.location).toBe('hand');
            expect(this.tanto.location).toBe('hand');

            expect(this.getChatLogs(5)).toContain('Fine Katana returns to player1\'s hand due to its Ancestral keyword');
        });

        it('should not let you trigger if no one has a weapon attachment', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.peak);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
