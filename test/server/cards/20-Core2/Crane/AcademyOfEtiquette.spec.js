describe('Academy of Etiquette', () => {
    describe('Courtesy option', function () {
        integration(function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-challenger', 'kakita-yoshi', 'kakita-toshimoko'],
                        dynastyDeck: [],
                        dynastyDiscard: ['academy-of-etiquette']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.academy = this.player1.findCardByName('academy-of-etiquette');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');

                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.shameful = this.player1.findCardByName('shameful-display', 'province 1');
                this.shameful.facedown = false;
                this.player1.placeCardInProvince(this.academy, 'province 1');
                this.academy.facedown = false;

                this.brash.honor();
                this.challenger.honor();
                this.yoshi.honor();
                this.whisperer.honor();
            });

            it('should react to fate phase beginning and give Courtesy to up to two characters', function () {
                let fate = this.player1.fate;
                this.nextPhase(); // fate phase
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.academy);
                this.player1.clickCard(this.academy);

                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).toBeAbleToSelect(this.yoshi);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);

                this.player1.clickCard(this.brash);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.challenger);
                this.player1.clickCard(this.yoshi);
                this.player1.clickPrompt('Done');

                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Academy of Etiquette to give Brash Samurai and Doji Challenger courtesy'
                );

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.player1.fate).toBe(fate + 2);
            });
        });
    });
});
