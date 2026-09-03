describe('Moto Zealot', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-zealot', 'doji-challenger', 'aranat']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');

            this.zealot = this.player1.findCardByName('moto-zealot');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.aranat = this.player1.findCardByName('aranat');
        });

        it('even characters, injure', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zealot],
                defenders: [this.mitsu]
            });
            this.player2.pass();

            this.player1.clickCard(this.zealot);
            this.player1.clickCard(this.mitsu);

            expect(this.player2).toHavePromptButton('Injure this character');
            expect(this.player2).toHavePromptButton('Place 1 fate on opponent\'s character');

            this.player2.clickPrompt('Injure this character');
            expect(this.mitsu.location).toBe('dynasty discard pile');
            expect(this.zealot.fate).toBe(0);

            expect(this.getChatLogs(5)).toContain('player1 uses Moto Zealot to injure Togashi Mitsu');
        });

        it('even characters, fate', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zealot],
                defenders: [this.mitsu]
            });
            this.player2.pass();

            this.player1.clickCard(this.zealot);
            this.player1.clickCard(this.mitsu);

            expect(this.player2).toHavePromptButton('Injure this character');
            expect(this.player2).toHavePromptButton('Place 1 fate on opponent\'s character');

            this.player2.clickPrompt('Place 1 fate on opponent\'s character');
            expect(this.mitsu.location).toBe('play area');
            expect(this.zealot.fate).toBe(1);

            expect(this.getChatLogs(5)).toContain('player1 uses Moto Zealot to place 1 fate on Moto Zealot');
        });

        it('more characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zealot, this.challenger],
                defenders: [this.mitsu]
            });
            this.player2.pass();

            this.player1.clickCard(this.zealot);
            this.player1.clickCard(this.mitsu);

            expect(this.player2).toHavePromptButton('Injure this character');
            expect(this.player2).toHavePromptButton('Place 1 fate on opponent\'s character');
        });

        it('fewer characters', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.zealot],
                defenders: [this.mitsu, this.whisperer]
            });
            this.player2.pass();

            this.player1.clickCard(this.zealot);

            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
