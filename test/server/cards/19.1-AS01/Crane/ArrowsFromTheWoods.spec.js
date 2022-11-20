describe('Arrows from the Woods', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'brash-samurai', 'isawa-tadaka']
                },
                player2: {
                    inPlay: ['kakita-yoshi', 'doji-challenger', 'adept-of-shadows'],
                    hand: ['arrows-from-the-woods']
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');
            this.adept = this.player2.findCardByName('adept-of-shadows');
            this.arrows = this.player2.findCardByName('arrows-from-the-woods');
        });

        it('should target a participating bushi you control', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.challenger, this.yoshi, this.adept]
            });

            this.player2.clickCard(this.arrows);
            expect(this.player2).not.toBeAbleToSelect(this.diplomat);
            expect(this.player2).not.toBeAbleToSelect(this.brash);
            expect(this.player2).not.toBeAbleToSelect(this.tadaka);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);
            expect(this.player2).toBeAbleToSelect(this.adept);
        });

        it('should give opponents characters -2 mil if you target a shinobi', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.tadaka],
                defenders: [this.yoshi, this.challenger, this.adept]
            });
            this.player2.clickCard(this.arrows);
            this.player2.clickCard(this.adept);
            expect(this.diplomat.getMilitarySkill()).toBe(0);
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.tadaka.getMilitarySkill()).toBe(3);
            expect(this.yoshi.getMilitarySkill()).toBe(2);

            expect(this.getChatLogs(10)).toContain('player2 plays Arrows from the Woods to give player1\'s participating characters -2military');
        });

        it('should give opponents characters -1 mil if you target a shinobi', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat, this.brash, this.tadaka],
                defenders: [this.yoshi, this.challenger, this.adept]
            });
            this.player2.clickCard(this.arrows);
            this.player2.clickCard(this.challenger);
            expect(this.diplomat.getMilitarySkill()).toBe(0);
            expect(this.brash.getMilitarySkill()).toBe(1);
            expect(this.tadaka.getMilitarySkill()).toBe(4);
            expect(this.yoshi.getMilitarySkill()).toBe(2);

            expect(this.getChatLogs(10)).toContain('player2 plays Arrows from the Woods to give player1\'s participating characters -1military');
        });
    });
});
