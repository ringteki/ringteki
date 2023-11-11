describe('Ferocious Banshee', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ferocious-banshee', 'hida-yakamo', 'bayushi-manipulator']
                },
                player2: {
                    inPlay: ['crisis-breaker', 'hantei-sotorii'],
                }
            });

            this.banshee = this.player1.findCardByName('ferocious-banshee');
            this.yakamo = this.player1.findCardByName('hida-yakamo');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');

            this.breaker = this.player2.findCardByName('crisis-breaker');
            this.sotorii = this.player2.findCardByName('hantei-sotorii');

        });

        it('Should get +3 if you control another Berserker', function () {
            let baseMil = this.banshee.getMilitarySkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.banshee, this.yakamo],
                defenders: [this.sotorii]
            });

            expect(this.banshee.getMilitarySkill()).toBe(baseMil + 3);
        });

        it('Should get +3 if your opponent controls an Berserker', function () {
            let baseMil = this.banshee.getMilitarySkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.banshee, this.manipulator],
                defenders: [this.breaker]
            });

            expect(this.banshee.getMilitarySkill()).toBe(baseMil + 3);
        });

        it('Should not get +3 if no other Berserkers', function () {
            let baseMil = this.banshee.getMilitarySkill();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.banshee, this.manipulator],
                defenders: [this.sotorii]
            });

            expect(this.banshee.getMilitarySkill()).toBe(baseMil);
        });
    });
});
