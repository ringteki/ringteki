describe('Stoicism', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'savvy-politician'],
                    hand: ['stoicism', 'way-of-the-crane', 'doji-fumiki'],
                    provinces: ['magistrate-station']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'doji-challenger'],
                    hand: ['assassination'],
                    provinces: ['manicured-garden']
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.savvy = this.player1.findCardByName('savvy-politician');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.stoicism = this.player1.findCardByName('stoicism');
            this.assassination = this.player2.findCardByName('assassination');
            this.garden = this.player2.findCardByName('manicured-garden');
            this.fumiki = this.player1.findCardByName('doji-fumiki');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.station = this.player1.findCardByName('magistrate-station');

            this.challenger.honor();

            this.brash.honor();
            this.savvy.dishonor();
            this.yoshi.taint();

            this.garden.facedown = false;
            this.garden.taint();
            this.garden.dishonor();

            this.station.facedown = false;
            this.station.taint();
            this.station.dishonor();
        });

        it('should ignore the effects of status tokens including on cards entering play after', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.brash, this.savvy],
                defenders: [this.yoshi],
                province: this.garden
            });

            let fate = this.player2.fate;

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.garden);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.pass();

            expect(this.brash.getMilitarySkill()).toBe(4);
            expect(this.savvy.getMilitarySkill()).toBe(0);
            expect(this.yoshi.getMilitarySkill()).toBe(4);
            expect(this.challenger.getMilitarySkill()).toBe(5);
            expect(this.garden.getStrength()).toBe(6);
            expect(this.station.getStrength()).toBe(5);
            expect(this.garden.isBlank()).toBe(true);
            expect(this.station.isBlank()).toBe(true);

            this.player1.clickCard(this.stoicism);

            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.savvy.getMilitarySkill()).toBe(1);
            expect(this.yoshi.getMilitarySkill()).toBe(2);
            expect(this.challenger.getMilitarySkill()).toBe(5);
            expect(this.garden.getStrength()).toBe(4);
            expect(this.station.getStrength()).toBe(5);
            expect(this.garden.isBlank()).toBe(false);
            expect(this.station.isBlank()).toBe(true);

            expect(this.getChatLogs(5)).toContain('player1 plays Stoicism to ignore the effects of status tokens until the end of the conflict');

            let honor = this.player1.honor;
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.brash);
            expect(this.player1.honor).toBe(honor);

            this.player1.clickCard(this.fumiki);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');

            expect(this.fumiki.location).toBe('play area');
            expect(this.fumiki.getMilitarySkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.fumiki);
            expect(this.fumiki.getMilitarySkill()).toBe(0);
            expect(this.fumiki.isHonored).toBe(true);

            this.player2.clickCard(this.garden);
            expect(this.player2.fate).toBe(fate + 1);
        });
    });
});
