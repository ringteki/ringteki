describe('Moto Raiju', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-raiju']
                },
                player2: {
                    inPlay: ['moto-raiju']
                }
            });

            this.raiju = this.player1.findCardByName('moto-raiju');
            this.raiju2 = this.player2.findCardByName('moto-raiju');
            this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.p4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.pStronghold = this.player2.findCardByName('shameful-display', 'stronghold province');
        });

        it('should have getMilitarySkill() equal to the number of faceup provinces you control', function() {
            const base = this.raiju.getMilitarySkill();

            this.p1.facedown = false;
            this.game.checkGameState(true);
            expect(this.raiju.getMilitarySkill()).toBe(base + 1);
            expect(this.raiju2.getMilitarySkill()).toBe(base);

            this.p2.facedown = false;
            this.game.checkGameState(true);
            expect(this.raiju.getMilitarySkill()).toBe(base + 2);
            expect(this.raiju2.getMilitarySkill()).toBe(base);

            this.p3.facedown = false;
            this.game.checkGameState(true);
            expect(this.raiju.getMilitarySkill()).toBe(base + 3);
            expect(this.raiju2.getMilitarySkill()).toBe(base);

            this.p4.facedown = false;
            this.game.checkGameState(true);
            expect(this.raiju.getMilitarySkill()).toBe(base + 4);
            expect(this.raiju2.getMilitarySkill()).toBe(base);

            this.pStronghold.facedown = false;
            this.game.checkGameState(true);
            expect(this.raiju.getMilitarySkill()).toBe(base + 4);
            expect(this.raiju2.getMilitarySkill()).toBe(base);
        });
    });
});
