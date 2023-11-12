describe('Kaito Yoshiaki', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kaito-yoshiaki'],
                    hand: ['jealous-ancestor']
                },
                player2: {
                    hand: ['fine-katana'],
                    inPlay: ['brash-samurai', 'doji-kuwanan']
                }
            });

            this.kaitoYoshiaki = this.player1.findCardByName('kaito-yoshiaki');
            this.jealousAncestor = this.player1.findCardByName('jealous-ancestor');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.brash.fate = 2;
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');

            this.noMoreActions();
        });

        it('choose non-unique character', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.kaitoYoshiaki);

            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.kuwanan);
        });

        it('set base to zero', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);
            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to set the base skills of Brash Samurai to 0military/0political'
            );
        });

        it('set base to zero, and remove fate when tainted', function () {
            this.brash.taint();

            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);
            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.brash.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to remove a fate from and set the base skills of Brash Samurai to 0military/0political'
            );
        });

        it('set base to zero, and remove fate when corrupt', function () {
            this.initiateConflict({
                attackers: [this.kaitoYoshiaki],
                defenders: [this.brash]
            });
            this.player2.clickCard(this.brash);

            this.player1.clickCard(this.jealousAncestor);
            this.player1.clickPrompt('Play Jealous Ancestor as an attachment');
            this.player1.clickCard(this.brash);

            this.player2.pass();

            this.player1.clickCard(this.kaitoYoshiaki);
            this.player1.clickCard(this.brash);
            expect(this.brash.getMilitarySkill()).toBe(2);
            expect(this.brash.fate).toBe(1);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Kaito Yoshiaki to remove a fate from and set the base skills of Brash Samurai to 0military/0political'
            );
        });
    });
});
