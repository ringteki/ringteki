describe('Grand Canyon', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bayushi-liar', 'attendant-to-the-emperor', 'young-rumormonger'],
                    provinces: ['fertile-fields', 'by-onnotangu-s-light']
                },
                player2: {
                    inPlay: ['ashigaru-levy', 'moto-youth', 'iuchi-shahai'],
                    provinces: ['grand-canyon', 'toshi-ranbo', 'entrenched-position']
                }
            });

            this.bayushiLiar = this.player1.findCardByName('bayushi-liar');
            this.attendantToTheEmperor = this.player1.findCardByName('attendant-to-the-emperor');
            this.fields = this.player1.findCardByName('fertile-fields');
            this.onnotangusLight = this.player1.findCardByName('by-onnotangu-s-light');

            this.ashigaruLevy = this.player2.findCardByName('ashigaru-levy');
            this.motoYouth = this.player2.findCardByName('moto-youth');
            this.grandCanyon = this.player2.findCardByName('grand-canyon');
            this.toshiRanbo = this.player2.findCardByName('toshi-ranbo');
            this.entrentched = this.player2.findCardByName('entrenched-position');

            this.grandCanyon.facedown = false;
            this.noMoreActions();
        });

        it('triggers when it is the attacked province', function () {
            this.initiateConflict({
                province: this.grandCanyon,
                ring: 'void',
                type: 'political',
                attackers: [this.bayushiLiar, this.attendantToTheEmperor],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
        });

        it('triggers when defending a water province', function () {
            this.initiateConflict({
                province: this.toshiRanbo,
                ring: 'void',
                type: 'political',
                attackers: [this.bayushiLiar, this.attendantToTheEmperor],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
        });

        it('triggers when attacking a water province', function () {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                province: this.onnotangusLight,
                ring: 'void',
                type: 'military',
                attackers: [this.ashigaruLevy, this.motoYouth],
                defenders: [this.attendantToTheEmperor]
            });

            this.player1.pass();
            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
        });

        it('does not trigger when defending a non-water province', function () {
            this.initiateConflict({
                province: this.entrentched,
                ring: 'void',
                type: 'political',
                attackers: [this.bayushiLiar, this.attendantToTheEmperor],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).not.toHavePrompt('Grand Canyon');
        });

        it('does not trigger when attacking a non-water province', function () {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                province: this.fields,
                ring: 'void',
                type: 'military',
                attackers: [this.ashigaruLevy, this.motoYouth],
                defenders: [this.attendantToTheEmperor]
            });

            this.player1.pass();
            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).not.toHavePrompt('Grand Canyon');
        });

        it('triggers when defending a non-water province during a water conflict', function () {
            this.initiateConflict({
                province: this.entrentched,
                ring: 'water',
                type: 'political',
                attackers: [this.bayushiLiar, this.attendantToTheEmperor],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
        });

        it('triggers when attacking a non-water province during a water conflict', function () {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                province: this.fields,
                ring: 'water',
                type: 'military',
                attackers: [this.ashigaruLevy, this.motoYouth],
                defenders: [this.attendantToTheEmperor]
            });

            this.player1.pass();
            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
        });

        it('flips the base skill of a character', function () {
            this.initiateConflict({
                province: this.grandCanyon,
                ring: 'void',
                type: 'political',
                attackers: [this.bayushiLiar, this.attendantToTheEmperor],
                defenders: [this.motoYouth]
            });

            this.player2.clickCard(this.grandCanyon);
            expect(this.player2).toHavePrompt('Grand Canyon');
            expect(this.player2).not.toBeAbleToSelect(this.bayushiLiar);
            expect(this.player2).toBeAbleToSelect(this.attendantToTheEmperor);
            expect(this.player2).toBeAbleToSelect(this.motoYouth);

            this.player2.clickCard(this.attendantToTheEmperor);
            expect(this.attendantToTheEmperor.militarySkill).toBe(5);
            expect(this.attendantToTheEmperor.politicalSkill).toBe(1);
        });
    });
});
