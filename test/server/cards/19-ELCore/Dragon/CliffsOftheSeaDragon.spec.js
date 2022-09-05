describe('Cliffs of the Sea Dragon', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-diplomat', 'shiba-tsukune']
                },
                player2: {
                    inPlay: ['daidoji-uji', 'doji-challenger'],
                    provinces: ['cliffs-of-the-sea-dragon', 'manicured-garden']
                }
            });
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.cliffs = this.player2.findCardByName('cliffs-of-the-sea-dragon');
            this.garden = this.player2.findCardByName('manicured-garden');
        });

        it('should stop opponent from taking fate from rings', function () {
            this.game.rings.air.fate = 5;
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji],
                province: this.cliffs,
                ring: 'air'
            });
            expect(this.player1.fate).toBe(fate);
        });

        it('if broken, should not stop opponent from taking fate from rings', function () {
            this.game.rings.air.fate = 5;
            this.cliffs.isBroken = true;
            let fate = this.player1.fate;
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.diplomat],
                defenders: [this.uji],
                province: this.garden,
                ring: 'air'
            });
            expect(this.player1.fate).toBe(fate + 5);
        });

        it('should not stop you from taking fate from rings', function () {
            this.game.rings.air.fate = 5;
            let fate = this.player2.fate;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.uji],
                defenders: [this.diplomat],
                ring: 'air'
            });
            expect(this.player2.fate).toBe(fate + 5);
        });
    });
});
