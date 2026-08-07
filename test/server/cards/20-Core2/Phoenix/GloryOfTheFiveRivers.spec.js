describe('Glory of the Five Rivers', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['glory-of-the-five-rivers'],
                    inPlay: ['fire-tensai-initiate', 'solemn-scholar', 'seppun-truthseeker']
                },
                player2: {
                    inPlay: ['brash-samurai', 'doji-whisperer']
                }
            });

            this.collectionOfAlms = this.player1.findCardByName('glory-of-the-five-rivers');
            this.fireTensai = this.player1.findCardByName('fire-tensai-initiate');
            this.solemn = this.player1.findCardByName('solemn-scholar');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
        });

        it('does a thing', function () {
            const p1InitialFate = this.player1.fate;
            const p2InitialFate = this.player2.fate;

            this.player1.clickCard(this.collectionOfAlms);
            expect(this.player1).toHavePrompt('Choose an amount of fate');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player2).toHavePrompt('Choose an amount of fate');
            expect(this.player2).toHavePromptButton('0');
            expect(this.player2).toHavePromptButton('1');
            expect(this.player2).toHavePromptButton('2');

            this.player1.clickPrompt('0');
            this.player2.clickPrompt('2');

            expect(this.player1.fate).toBe(p1InitialFate - 0);
            expect(this.player2.fate).toBe(p2InitialFate - 2);
            expect(this.getChatLogs(5)).toContain('player1 plays Glory of the Five Rivers to collect offerings');
            expect(this.getChatLogs(5)).toContain('player1 spends 0 fate');
            expect(this.getChatLogs(5)).toContain('player2 spends 2 fate');

            // Winner (player2) chooses a character to dishonor — can target any character
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.fireTensai);
            expect(this.player2).toBeAbleToSelect(this.solemn);
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.solemn);

            // Winner (player2) chooses a character to honor — can target any character
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.brash);
            expect(this.player2).toBeAbleToSelect(this.whisperer);
            this.player2.clickCard(this.brash);

            expect(this.solemn.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 dishonors Solemn Scholar');
            expect(this.brash.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 honors Brash Samurai');

            // Neither pick may stay highlighted once both selections have resolved
            expect(this.player2.player.promptState.selectedCards).toEqual([]);
            expect(this.solemn.getSummary(this.player2.player).selected).toBe(false);
            expect(this.brash.getSummary(this.player2.player).selected).toBe(false);
        });
    });
});
