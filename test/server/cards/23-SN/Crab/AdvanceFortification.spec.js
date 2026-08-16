describe('Advance Fortification', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'doji-challenger']
                },
                player2: {
                    inPlay: ['borderlands-defender'],
                    dynastyDeck: ['advance-fortification']
                }
            });
            this.fort = this.player2.placeCardInProvince('advance-fortification', 'province 1');
            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.borderlandsDefender = this.player2.findCardByName('borderlands-defender');

            this.berserker = this.player1.findCardByName('matsu-berserker');
            this.challenger = this.player1.findCardByName('doji-challenger');
        });

        it('should give +1/+1 to defenders at same province', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.borderlandsDefender],
                province: this.sd1
            });
            let mil = this.borderlandsDefender.getMilitarySkill();
            let pol = this.borderlandsDefender.getPoliticalSkill();
            this.player2.clickCard(this.fort);
            expect(this.borderlandsDefender.getMilitarySkill()).toBe(mil + 1);
            expect(this.borderlandsDefender.getPoliticalSkill()).toBe(pol + 1);
            expect(this.getChatLogs(5)).toContain('player2 uses Advance Fortification to give defending characters +1/+1');
        });

        it('should make opponent lose 1 honor if not at province', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.borderlandsDefender],
                province: this.sd2
            });
            let honor = this.player1.honor;
            let honor2 = this.player2.honor;
            this.player2.clickCard(this.fort);

            expect(this.player1.honor).toBe(honor - 1);
            expect(this.player2.honor).toBe(honor2);
            expect(this.getChatLogs(5)).toContain('player2 uses Advance Fortification to make player1 lose 1 honor');
        });

        it('should not trigger if it\'s on a broken province', function () {
            this.sd1.isBroken = true;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.berserker],
                defenders: [this.borderlandsDefender],
                province: this.sd2
            });
            this.player2.clickCard(this.fort);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not trigger on attack', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.borderlandsDefender],
                defenders: [this.challenger]
            });
            this.player1.pass();
            this.player2.clickCard(this.fort);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });
    });
});
