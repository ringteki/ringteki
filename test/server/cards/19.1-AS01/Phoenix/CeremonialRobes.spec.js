describe('Ceremonial Robes', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'ceremonial-robes',
                        'kami-of-ancient-wisdom',
                        'solemn-scholar',
                        'guardian-dojo'
                    ]
                }
            });

            this.robes = this.player1.findCardByName('ceremonial-robes');

            this.kami = this.player1.findCardByName('kami-of-ancient-wisdom');
            this.solemn = this.player1.findCardByName('solemn-scholar');
            this.dojo = this.player1.findCardByName('guardian-dojo');

            this.p11 = this.player1.findCardByName(
                'shameful-display',
                'province 1'
            );
            this.p12 = this.player2.findCardByName(
                'shameful-display',
                'province 1'
            );
        });

        it('filters cards, put 1 in a province', function () {
            this.player1.player.moveCard(this.kami, 'dynasty deck');
            this.player1.player.moveCard(this.solemn, 'dynasty deck');
            this.player1.player.moveCard(this.dojo, 'dynasty deck');

            let p1InitialHonor = this.player1.honor;
            let p2InitialHonor = this.player2.honor;

            this.player1.clickCard(this.robes);
            expect(this.player1).toHavePrompt('Choose a province');

            this.player1.clickCard(this.p11);
            expect(this.player1).toHavePrompt(
                'Select a card to put on the bottom of the deck'
            );
            expect(this.player1).toHavePromptButton('Guardian Dōjō');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Kami of Ancient Wisdom');

            this.player1.clickPrompt('Guardian Dōjō');
            expect(this.dojo.location).toBe('dynasty deck');

            expect(this.player1).toHavePrompt(
                'Select a card to put into the province faceup'
            );
            expect(this.player1).not.toHavePromptButton('Guardian Dōjō');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Kami of Ancient Wisdom');

            this.player1.clickPrompt('Kami of Ancient Wisdom');
            expect(this.kami.location).toBe('province 1');
            expect(this.kami.facedown).toBe(false);

            expect(this.solemn.location).toBe('dynasty discard pile');
            expect(this.player1.honor).toBe(p1InitialHonor);
            expect(this.player2.honor).toBe(p2InitialHonor);

            expect(this.player1).toHavePrompt(
                'Waiting for opponent to take an action or pass'
            );

            expect(this.getChatLogs(5)).toContain(
                'player1 uses Ceremonial Robes to look at the top 3 cards of their dynasty deck'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 places a card on the bottom of the deck'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 places Kami of Ancient Wisdom into Shameful Display'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 discards Solemn Scholar'
            );
        });

        it('filters cards, put 1 in a province, and make players lose honor when discarding a spirit', function () {
            this.player1.player.moveCard(this.kami, 'dynasty deck');
            this.player1.player.moveCard(this.solemn, 'dynasty deck');
            this.player1.player.moveCard(this.dojo, 'dynasty deck');

            let p1InitialHonor = this.player1.honor;
            let p2InitialHonor = this.player2.honor;

            this.player1.clickCard(this.robes);
            expect(this.player1).toHavePrompt('Choose a province');

            this.player1.clickCard(this.p11);
            expect(this.player1).toHavePrompt(
                'Select a card to put on the bottom of the deck'
            );
            expect(this.player1).toHavePromptButton('Guardian Dōjō');
            expect(this.player1).toHavePromptButton('Solemn Scholar');
            expect(this.player1).toHavePromptButton('Kami of Ancient Wisdom');

            this.player1.clickPrompt('Solemn Scholar');
            expect(this.solemn.location).toBe('dynasty deck');

            expect(this.player1).toHavePrompt(
                'Select a card to put into the province faceup'
            );
            expect(this.player1).toHavePromptButton('Guardian Dōjō');
            expect(this.player1).toHavePromptButton('Kami of Ancient Wisdom');
            expect(this.player1).not.toHavePromptButton('Solemn Scholar');

            this.player1.clickPrompt('Guardian Dōjō');
            expect(this.dojo.location).toBe('province 1');
            expect(this.dojo.facedown).toBe(false);

            expect(this.kami.location).toBe('dynasty discard pile');
            expect(this.player1.honor).toBe(p1InitialHonor - 1);
            expect(this.player2.honor).toBe(p2InitialHonor - 1);

            expect(this.player1).toHavePrompt(
                'Waiting for opponent to take an action or pass'
            );

            expect(this.getChatLogs(5)).toContain(
                'player1 uses Ceremonial Robes to look at the top 3 cards of their dynasty deck'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 places a card on the bottom of the deck'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 places Guardian Dōjō into Shameful Display'
            );
            expect(this.getChatLogs(5)).toContain(
                'player1 discards Kami of Ancient Wisdom'
            );
            expect(this.getChatLogs(5)).toContain(
                'Kami of Ancient Wisdom was a Spirit! player1 and player2 lose 1 honor'
            );
        });
    });
});
