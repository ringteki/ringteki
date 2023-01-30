describe('Shore of the Ashen Flames', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto'],
                    hand: [
                        'a-perfect-cut',
                        'fine-katana',
                        'curved-blade',
                        'invocation-of-ash',
                        'fiery-madness'
                    ]
                },
                player2: {
                    provinces: ['shore-of-the-ashen-flames']
                }
            });

            this.aggressiveMoto =
                this.player1.findCardByName('aggressive-moto');
            this.perfectCut = this.player1.findCardByName('a-perfect-cut');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.curvedBlade = this.player1.findCardByName('curved-blade');
            this.invocationOfAsh =
                this.player1.findCardByName('invocation-of-ash');
            this.fieryMadness = this.player1.findCardByName('fiery-madness');

            this.shoreOfTheAshenFlames = this.player2.findCardByName(
                'shore-of-the-ashen-flames',
                'province 1'
            );
        });

        it('denies attachment bonuses', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.invocationOfAsh);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.curvedBlade);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);
        });

        it('allows attachment penalties', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.fieryMadness);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.getMilitarySkill()).toBe(1);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);
        });

        it('allows event bonuses', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [],
                province: this.shoreOfTheAshenFlames,
                type: 'military'
            });

            expect(this.aggressiveMoto.getMilitarySkill()).toBe(3);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);

            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.aggressiveMoto);
            expect(this.aggressiveMoto.getMilitarySkill()).toBe(5);
            expect(this.aggressiveMoto.getPoliticalSkill()).toBe(0);
        });
    });
});
