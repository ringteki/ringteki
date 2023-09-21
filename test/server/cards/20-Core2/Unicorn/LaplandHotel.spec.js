xdescribe('Lapland Hotel', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-aramoro']
                },
                player2: {
                    inPlay: ['young-harrier'],
                    hand: ['way-of-the-crane'],
                    provinces: ['lapland-hotel']
                }
            });
            this.bayushiAramoro = this.player1.findCardByName('bayushi-aramoro');
            this.youngHarrier = this.player2.findCardByName('young-harrier');
            this.wayOfTheCrane = this.player2.findCardByName('way-of-the-crane');

            this.laplandHotel = this.player2.findCardByName('lapland-hotel', 'province 1');
            this.noMoreActions();
        });

        it('should stop dishonor status modifying both skills', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(this.youngHarrier.isDishonored).toBe(false);
            this.player2.clickCard(this.youngHarrier);
            expect(this.youngHarrier.isDishonored).toBe(true);
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
        });

        it('should stop honor status modifying both skills', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(this.youngHarrier.isHonored).toBe(false);
            this.player2.clickCard(this.wayOfTheCrane);
            this.player2.clickCard(this.youngHarrier);
            expect(this.youngHarrier.isHonored).toBe(true);
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
        });

        it('should stop dishonor status modifying both skills', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(this.youngHarrier.isHonored).toBe(false);
            this.player2.clickCard(this.wayOfTheCrane);
            this.player2.clickCard(this.youngHarrier);
            expect(this.youngHarrier.isHonored).toBe(true);
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(
                this.youngHarrier
                    .getMilitaryModifiers()
                    .some((modifier) => modifier.name === 'Honored Token (Lapland Hotel)' && modifier.amount === 0)
            ).toBe(true);
            expect(
                this.youngHarrier
                    .getPoliticalModifiers()
                    .some((modifier) => modifier.name === 'Honored Token (Lapland Hotel)' && modifier.amount === 0)
            ).toBe(true);
        });

        it('should stop tainted status modifying skills', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(this.youngHarrier.isTainted).toBe(false);
            this.youngHarrier.taint();
            this.game.checkGameState(true);
            expect(this.youngHarrier.isTainted).toBe(true);
            expect(this.youngHarrier.getMilitarySkill()).toBe(1);
            expect(this.youngHarrier.getPoliticalSkill()).toBe(1);
            expect(
                this.youngHarrier
                    .getMilitaryModifiers()
                    .some((modifier) => modifier.name === 'Tainted Token (Lapland Hotel)' && modifier.amount === 0)
            ).toBe(true);
            expect(
                this.youngHarrier
                    .getPoliticalModifiers()
                    .some((modifier) => modifier.name === 'Tainted Token (Lapland Hotel)' && modifier.amount === 0)
            ).toBe(true);
        });

        it('should stop honor status adding honor on leaving play', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            this.player2.clickCard(this.wayOfTheCrane);
            this.player2.clickCard(this.youngHarrier);
            expect(this.youngHarrier.isHonored).toBe(true);
            const honor = this.player2.player.honor;
            this.player1.clickCard(this.bayushiAramoro);
            this.player1.clickCard(this.youngHarrier);
            expect(this.youngHarrier.location).toBe('conflict discard pile');
            expect(this.player2.player.honor).toBe(honor);
        });

        it('should stop dishonor status losing honor on leaving play', function () {
            this.initiateConflict({
                attackers: [this.bayushiAramoro],
                defenders: [this.youngHarrier],
                province: this.laplandHotel
            });
            this.player2.clickCard(this.youngHarrier);
            expect(this.youngHarrier.isDishonored).toBe(true);
            const honor = this.player2.player.honor;
            this.player1.clickCard(this.bayushiAramoro);
            this.player1.clickCard(this.youngHarrier);
            expect(this.youngHarrier.location).toBe('conflict discard pile');
            expect(this.player2.player.honor).toBe(honor);
        });
    });
});
