describe('Utaku Prodigy', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['utaku-prodigy', 'doji-challenger', 'aranat', 'brash-samurai'],
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                    hand: ['assassination', 'way-of-the-scorpion']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.assassination = this.player2.findCardByName('assassination');
            this.scorp = this.player2.findCardByName('way-of-the-scorpion');

            this.prodigy = this.player1.findCardByName('utaku-prodigy');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
            this.brash = this.player1.findCardByName('brash-samurai');

            this.brash.honor();
            this.mystic.honor();
        });

        it('my honor gain', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prodigy],
                defenders: [this.mitsu],
            });
            let honor = this.player1.honor;
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.brash);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.prodigy);
            this.player1.clickCard(this.prodigy);

            expect(this.player1.honor).toBe(honor + 2);
            expect(this.getChatLogs(5)).toContain('player1 uses Utaku Prodigy to instead gain 2 honor from the status token');
        });

        it('opponent honor gain', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prodigy],
                defenders: [this.mitsu],
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.mystic);

            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('dishonor tokens', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.prodigy],
                defenders: [this.mitsu],
            });
            this.player2.clickCard(this.scorp);
            expect(this.player2).not.toBeAbleToSelect(this.prodigy);
            expect(this.player2).toBeAbleToSelect(this.mitsu);
        });
    });
});
