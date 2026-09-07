describe('Daidoji Nakatama', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['daidoji-nakatama', 'brash-samurai'],
                    dynastyDeck: ['favorable-ground']
                },
                player2: {
                    inPlay: ['student-of-the-tao', 'doji-kuwanan']
                }
            });
            this.ground = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.ground.facedown = false;
            this.nakatama = this.player1.findCardByName('daidoji-nakatama');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.tao = this.player2.findCardByName('student-of-the-tao');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
        });

        it('block send home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nakatama],
                defenders: [this.tao, this.kuwanan]
            });
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.tao);
            expect(this.player2).toHavePrompt('Conflict Action Window');

            this.player2.pass();
            this.player1.clickCard(this.ground);
            this.player1.clickCard(this.brash);

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.tao);
            expect(this.player2).toHavePrompt('Student of the Tao');
            expect(this.player2).toBeAbleToSelect(this.nakatama);
            expect(this.player2).toBeAbleToSelect(this.brash);

            this.player2.clickCard(this.nakatama);
            expect(this.nakatama.isParticipating()).toBe(false);
        });

        it('ready and dishonor', function () {
            this.tao.bowed = true;
            this.kuwanan.bowed = true;
            this.nakatama.bowed = true;

            this.player1.clickCard(this.nakatama);
            expect(this.player1).not.toBeAbleToSelect(this.nakatama);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.tao);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

            this.player1.clickCard(this.tao);

            expect(this.tao.isDishonored).toBe(true);
            expect(this.tao.bowed).toBe(false);

            expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Nakatama to ready and dishonor Student of the Tao');
        });

        it('ready already dishonored character', function () {
            this.brash.bowed = true;
            this.brash.dishonor();

            this.player1.clickCard(this.nakatama);
            this.player1.clickCard(this.brash);

            expect(this.brash.isDishonored).toBe(true);
            expect(this.brash.bowed).toBe(false);

            expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Nakatama to ready and dishonor Brash Samurai');
        });
    });
});
