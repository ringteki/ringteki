describe('Hiruma\'s Eyes', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai'],
                    hand: ['hiruma-s-eyes']
                },
                player2: {
                    inPlay: ['doji-challenger', 'border-rider', 'kakita-yoshi'],
                    hand: [],
                    dynastyDiscard: [
                        'kakita-toshimoko',
                    ],
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.eyes = this.player1.findCardByName('hiruma-s-eyes');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.rider = this.player2.findCardByName('border-rider');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.p3_2 = this.player2.findCardByName('shameful-display', 'province 3');

            this.player2.placeCardInProvince(this.toshimoko, 'province 3');
        });

        it('choose -2 military', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.challenger, this.rider, this.yoshi],
                province: this.p3_2,
            });

            let brashMil = this.brash.getMilitarySkill();
            let riderMil = this.rider.getMilitarySkill();
            let challengerMil = this.challenger.getMilitarySkill();
            let yoshiMil = this.yoshi.getMilitarySkill();

            this.player2.pass();
            this.player1.clickCard(this.eyes);
            expect(this.player1).toBeAbleToSelect(this.toshimoko);
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('Give -2')
            expect(this.brash.getMilitarySkill()).toBe(brashMil);
            expect(this.rider.getMilitarySkill()).toBe(riderMil - 2);
            expect(this.challenger.getMilitarySkill()).toBe(challengerMil - 2);
            expect(this.yoshi.getMilitarySkill()).toBe(yoshiMil);
            expect(this.getChatLogs(5)).toContain('player1 plays Hiruma\'s Eyes to give Doji Challenger and Border Rider -2military until the end of the conflict');
        });

        it('choose +2 military', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.brash],
                defenders: [this.challenger, this.rider, this.yoshi],
                province: this.p3_2,
            });

            let brashMil = this.brash.getMilitarySkill();
            let riderMil = this.rider.getMilitarySkill();
            let challengerMil = this.challenger.getMilitarySkill();
            let yoshiMil = this.yoshi.getMilitarySkill();

            this.player2.pass();
            this.player1.clickCard(this.eyes);
            expect(this.player1).toBeAbleToSelect(this.toshimoko);
            this.player1.clickCard(this.toshimoko);
            this.player1.clickPrompt('Give +2')
            expect(this.brash.getMilitarySkill()).toBe(brashMil);
            expect(this.rider.getMilitarySkill()).toBe(riderMil + 2);
            expect(this.challenger.getMilitarySkill()).toBe(challengerMil + 2);
            expect(this.yoshi.getMilitarySkill()).toBe(yoshiMil);
            expect(this.getChatLogs(5)).toContain('player1 plays Hiruma\'s Eyes to give Doji Challenger and Border Rider +2military until the end of the conflict');
        });

    });
});
