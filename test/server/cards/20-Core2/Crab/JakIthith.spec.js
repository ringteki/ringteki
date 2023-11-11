describe("Jak'Ithith", function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-initiate'],
                    hand: ['centipede-tattoo', 'fine-katana']
                },
                player2: {
                    inPlay: ['jak-ithith', 'borderlands-defender'],
                    hand: ['lurking-affliction']
                }
            });

            this.borderlands = this.player2.findCardByName('borderlands-defender');
            this.jakithit = this.player2.findCardByName('jak-ithith');

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.tattoo = this.player1.findCardByName('centipede-tattoo');
            this.katana = this.player1.findCardByName('fine-katana');
            this.affliction = this.player2.findCardByName('lurking-affliction');

            this.player1.clickCard(this.tattoo);
            this.player1.clickCard(this.initiate);
            this.player2.pass();
            this.player1.clickCard(this.katana);
            this.player1.clickCard(this.initiate);
        });

        it('steals attachments when it can attach them', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.borderlands, this.jakithit],
                type: 'military'
            });
            this.noMoreActions();

            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.jakithit);
            expect(this.player2).toHavePrompt('Choose an attachment');
            expect(this.player2).toBeAbleToSelect(this.tattoo);
            expect(this.player2).toBeAbleToSelect(this.katana);

            this.player2.clickCard(this.katana);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.jakithit);
            expect(this.player2).toBeAbleToSelect(this.borderlands);

            this.player2.clickCard(this.borderlands);
            expect(this.borderlands.attachments).toContain(this.katana);
            expect(this.getChatLogs(5)).toContain("player2 uses Jak'ithith to take control of and attach Togashi Initiate's Fine Katana to Borderlands Defender");
        });

        it('discards attachments when it can not attach them', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.borderlands, this.jakithit],
                type: 'military'
            });
            this.noMoreActions();

            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.jakithit);
            expect(this.player2).toHavePrompt('Choose an attachment');
            expect(this.player2).toBeAbleToSelect(this.tattoo);
            expect(this.player2).toBeAbleToSelect(this.katana);

            this.player2.clickCard(this.tattoo);
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.jakithit);
            expect(this.player2).toBeAbleToSelect(this.borderlands);

            this.player2.clickCard(this.borderlands);
            expect(this.tattoo.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain("player2 uses Jak'ithith to discard Centipede Tattoo");
        });

        it('does not work from home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.borderlands],
                type: 'military'
            });
            this.initiate.bow();
            this.noMoreActions();

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('cannot be tainted', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.initiate],
                defenders: [this.borderlands, this.jakithit],
                type: 'military'
            });

            this.player2.clickCard(this.affliction);
            expect(this.player2).toBeAbleToSelect(this.borderlands);
            expect(this.player2).not.toBeAbleToSelect(this.jakithit);
        });
    });
});
