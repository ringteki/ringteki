describe('Ikoma Ujio', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ikoma-ujio', 'doji-challenger'],
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'doji-diplomat'],
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.diplomat = this.player2.findCardByName('doji-diplomat');

            this.ujio = this.player1.findCardByName('ikoma-ujio');
            this.challenger = this.player1.findCardByName('doji-challenger');
        });

        it('pol conflict only', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'military'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('duel tie', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);
            expect(this.getChatLogs(5)).toContain('player1 uses Ikoma Ujio to initiate a military duel : Ikoma Ujio vs. Togashi Mitsu');

            this.player1.clickPrompt('2');
            this.player2.clickPrompt('1');
            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(5)).toContain('The duel ends in a draw');
            expect(this.getChatLogs(5)).toContain('The duel has no effect');
        });

        it('duel win - bow', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');
            expect(this.player2).toHavePromptButton('Give opponent 1 honor');
            expect(this.player2).toHavePromptButton('Bow duel loser');

            this.player2.clickPrompt('Bow duel loser');
            expect(this.mitsu.bowed).toBe(true);
            expect(this.ujio.bowed).toBe(false);
            expect(this.getChatLogs(5)).toContain('Duel Effect: player2 chooses whether to bow Togashi Mitsu or give 1 honor to player1');
            expect(this.getChatLogs(5)).toContain('player2 chooses to bow Togashi Mitsu');
        });

        it('duel win - give 1 honor', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');
            expect(this.player2).toHavePromptButton('Give opponent 1 honor');
            expect(this.player2).toHavePromptButton('Bow duel loser');

            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickPrompt('Give opponent 1 honor');
            expect(this.mitsu.bowed).toBe(false);
            expect(this.player1.honor).toBe(honor1 + 1);
            expect(this.player2.honor).toBe(honor2 - 1);
            expect(this.getChatLogs(5)).toContain('Duel Effect: player2 chooses whether to bow Togashi Mitsu or give 1 honor to player1');
            expect(this.getChatLogs(5)).toContain('player2 chooses to give 1 honor to their opponent');
        });

        it('duel win - force honor', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();
            this.mitsu.bow();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);

            this.player1.clickPrompt('5');
            this.player2.clickPrompt('1');
            expect(this.player2).toHavePromptButton('Give opponent 1 honor');
            expect(this.player2).not.toHavePromptButton('Bow duel loser');

            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player2.clickPrompt('Give opponent 1 honor');
            expect(this.player1.honor).toBe(honor1 + 1);
            expect(this.player2.honor).toBe(honor2 - 1);
            expect(this.getChatLogs(5)).toContain('Duel Effect: player2 chooses whether to bow Togashi Mitsu or give 1 honor to player1');
            expect(this.getChatLogs(5)).toContain('player2 chooses to give 1 honor to their opponent');
        });

        it('duel loss - bow', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePromptButton('Give opponent 1 honor');
            expect(this.player1).toHavePromptButton('Bow duel loser');

            this.player1.clickPrompt('Bow duel loser');
            expect(this.mitsu.bowed).toBe(false);
            expect(this.ujio.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('Duel Effect: player1 chooses whether to bow Ikoma Ujio or give 1 honor to player2');
            expect(this.getChatLogs(5)).toContain('player1 chooses to bow Ikoma Ujio');
        });

        it('duel loss - give 1 honor', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ujio, this.challenger],
                defenders: [this.mitsu, this.whisperer, this.diplomat],
                type: 'political'
            });

            this.player2.pass();

            this.player1.clickCard(this.ujio);
            this.player1.clickCard(this.mitsu);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePromptButton('Give opponent 1 honor');
            expect(this.player1).toHavePromptButton('Bow duel loser');

            let honor1 = this.player1.honor;
            let honor2 = this.player2.honor;

            this.player1.clickPrompt('Give opponent 1 honor');
            expect(this.ujio.bowed).toBe(false);
            expect(this.player1.honor).toBe(honor1 - 1);
            expect(this.player2.honor).toBe(honor2 + 1);
            expect(this.getChatLogs(5)).toContain('Duel Effect: player1 chooses whether to bow Ikoma Ujio or give 1 honor to player2');
            expect(this.getChatLogs(5)).toContain('player1 chooses to give 1 honor to their opponent');
        });
    });
});
