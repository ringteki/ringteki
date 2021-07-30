describe('Yuta', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['yuta']
                },
                player2: {
                }
            });

            this.yuta = this.player1.findCardByName('yuta');
        });

        it('should get +2/+2 with 2 or more fate', function() {
            let mil = this.yuta.getMilitarySkill();
            let pol = this.yuta.getPoliticalSkill();

            this.yuta.fate = 2;
            this.game.checkGameState(true);
            expect(this.yuta.getMilitarySkill()).toBe(mil + 2);
            expect(this.yuta.getPoliticalSkill()).toBe(pol + 2);

            this.yuta.fate = 5;
            this.game.checkGameState(true);
            expect(this.yuta.getMilitarySkill()).toBe(mil + 2);
            expect(this.yuta.getPoliticalSkill()).toBe(pol + 2);

            this.yuta.fate = 1;
            this.game.checkGameState(true);
            expect(this.yuta.getMilitarySkill()).toBe(mil);
            expect(this.yuta.getPoliticalSkill()).toBe(pol);
        });
    });
});
