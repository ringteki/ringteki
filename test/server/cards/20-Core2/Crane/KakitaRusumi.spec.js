describe('Kakita Rusumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-rusumi'],
                    dynastyDiscard: [
                        'brash-samurai',
                        'paragon-of-grace',
                        'doji-whisperer',
                        'otomo-sycophant',
                        'imperial-storehouse'
                    ]
                }
            });

            this.player1.reduceDeckToNumber('dynasty deck', 0);

            this.storehouse = this.player1.moveCard('imperial-storehouse', 'dynasty deck');
            this.sycophant = this.player1.moveCard('otomo-sycophant', 'dynasty deck');
            this.whisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');
            this.paragon = this.player1.moveCard('paragon-of-grace', 'dynasty deck');
            this.brash = this.player1.moveCard('brash-samurai', 'dynasty deck');

            this.rusumi = this.player1.findCardByName('kakita-rusumi');
        });

        it('should not work outside of a conflict', function () {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.rusumi);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should search your top 4 cards', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            expect(this.player1).toHavePrompt('Choose a character to put into play');
            expect(this.player1).toHavePromptButton('Brash Samurai');
            expect(this.player1).toHaveDisabledPromptButton('Paragon of Grace');
            expect(this.player1).toHaveDisabledPromptButton('Otomo Sycophant');
            expect(this.player1).toHavePromptButton('Doji Whisperer');
            expect(this.player1).toHavePromptButton('Take nothing');
        });

        it('should put the chosen character into the conflict', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.game.currentConflict.attackers).toContain(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);
        });

        it('chat messages', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            this.player1.clickPrompt('Doji Whisperer');

            expect(this.getChatLogs(6)).toContain(
                'player1 uses Kakita Rusumi to search their dynasty deck for a character to put into play'
            );
            expect(this.getChatLogs(6)).toContain('player1 puts Doji Whisperer into play honored');
        });

        it('chat messages - taking nothing', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            this.player1.clickPrompt('Take nothing');

            expect(this.getChatLogs(6)).toContain(
                'player1 uses Kakita Rusumi to search their dynasty deck for a character to put into play'
            );
            expect(this.getChatLogs(6)).toContain('player1 takes nothing');
        });

        it('should shuffle your dynasty deck', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.getChatLogs(6)).toContain('player1 is shuffling their dynasty deck');
        });

        it('should discard the character at the end of the conflict', function () {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.rusumi],
                defenders: [],
                type: 'military'
            });
            this.player2.pass();
            this.player1.clickCard(this.rusumi);
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.game.currentConflict.attackers).toContain(this.whisperer);
            expect(this.whisperer.isHonored).toBe(true);

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.whisperer.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('Doji Whisperer is discarded from play due to Kakita Rusumi\'s effect');
        });
    });
});
