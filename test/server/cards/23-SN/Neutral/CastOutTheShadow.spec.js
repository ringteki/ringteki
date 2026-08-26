describe('Cast Out the Shadow', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['miya-mystic', 'doji-challenger'],
                    hand: ['cast-out-the-shadow']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'damned-hida', 'goblin-sneak'],
                    hand: ['fine-katana']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.cast = this.player1.findCardByName('cast-out-the-shadow');

            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.hida = this.player2.findCardByName('damned-hida');
            this.katana = this.player2.findCardByName('fine-katana');
            this.sneak = this.player2.findCardByName('goblin-sneak');

            this.player1.pass();
            this.player2.playAttachment(this.katana, this.mitsu);
            this.whisperer.taint();
            this.challenger.taint();
        });

        it('sacrifice', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu, this.whisperer, this.hida],
            });

            this.player2.pass();

            this.player1.clickCard(this.cast);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.hida);
            expect(this.player1).not.toBeAbleToSelect(this.sneak);
            this.player1.clickCard(this.whisperer);

            expect(this.player2).toHavePromptButton('Give opponent 2 honor');
            expect(this.player2).toHavePromptButton('Sacrifice this character');

            this.player2.clickPrompt('Sacrifice this character');
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Cast out the Shadow to sacrifice Doji Whisperer');
        });

        it('honor transfer', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu, this.whisperer, this.hida],
            });

            let honor = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.pass();

            this.player1.clickCard(this.cast);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).toBeAbleToSelect(this.hida);
            expect(this.player1).not.toBeAbleToSelect(this.sneak);
            this.player1.clickCard(this.whisperer);

            expect(this.player2).toHavePromptButton('Give opponent 2 honor');
            expect(this.player2).toHavePromptButton('Sacrifice this character');

            this.player2.clickPrompt('Give opponent 2 honor');
            expect(this.whisperer.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain('player1 plays Cast out the Shadow to take 2 honor from player2');
            expect(this.player1.honor).toBe(honor + 2);
            expect(this.player2.honor).toBe(honor2 - 2);
        });

        it('no shugenja', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu, this.whisperer, this.hida],
            });

            this.player2.pass();
            this.player1.clickCard(this.mystic);
            this.player1.clickCard(this.katana);
            this.player2.pass();

            this.player1.clickCard(this.cast);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
