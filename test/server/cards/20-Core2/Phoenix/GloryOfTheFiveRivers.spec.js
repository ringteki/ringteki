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

        fit('does a thing', function () {
            const p1InitialFate = this.player1.fate;
            const p2InitialFate = this.player2.fate;

            this.player1.clickCard(this.collectionOfAlms);
            expect(this.player1).toHavePrompt('Choose an amount of fate');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            expect(this.player1).toHavePromptButton('5');
            expect(this.player1).toHavePromptButton('6');
            expect(this.player1).toHavePromptButton('7');
            expect(this.player1).toHavePromptButton('8');
            expect(this.player2).toHavePrompt('Choose an amount of fate');
            expect(this.player2).toHavePromptButton('0');
            expect(this.player2).toHavePromptButton('1');
            expect(this.player2).toHavePromptButton('2');
            expect(this.player2).toHavePromptButton('3');
            expect(this.player2).toHavePromptButton('4');
            expect(this.player2).toHavePromptButton('5');
            expect(this.player2).toHavePromptButton('6');
            expect(this.player2).toHavePromptButton('7');
            expect(this.player2).not.toHavePromptButton('8');

            this.player1.clickPrompt('0');
            this.player2.clickPrompt('2');

            expect(this.player1.fate).toBe(p1InitialFate - 0);
            expect(this.player2.fate).toBe(p2InitialFate - 2);
            expect(this.getChatLogs(5)).toContain('player1 plays Heart of the inferno to bow Doji Whisperer');
        });

        it('without affinity, bow a character without attachment', function () {
            this.player1.moveCard(this.fireTensai, 'dynasty discard pile');

            this.player2.pass();
            this.player1.clickCard(this.heartOfTheInferno);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.fireTensai);
            expect(this.player1).not.toBeAbleToSelect(this.solemn);
            expect(this.player1).not.toBeAbleToSelect(this.valiant);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Heart of the inferno to bow Doji Whisperer');
        });

        it('with affinity, bow a character without attachment', function () {
            this.player2.pass();
            this.player1.clickCard(this.heartOfTheInferno);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.fireTensai);
            expect(this.player1).not.toBeAbleToSelect(this.solemn);
            expect(this.player1).not.toBeAbleToSelect(this.valiant);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays Heart of the inferno to bow Doji Whisperer');
        });

        it('with affinity, discard an attachment', function () {
            this.player2.pass();
            this.player1.clickCard(this.heartOfTheInferno);
            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.fireTensai);
            expect(this.player1).not.toBeAbleToSelect(this.solemn);
            expect(this.player1).not.toBeAbleToSelect(this.valiant);
            expect(this.player1).not.toBeAbleToSelect(this.brash);
            expect(this.player1).toBeAbleToSelect(this.katana);
            expect(this.player1).toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.katana);
            expect(this.katana.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 plays Heart of the inferno to bow Fine Katana');
            expect(this.getChatLogs(5)).toContain('player1 channels their fire affinity to discard Fine Katana');
        });
    });
});
