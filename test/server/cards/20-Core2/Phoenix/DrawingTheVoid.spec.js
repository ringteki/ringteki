describe('Drawing the Void', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['akodo-kaede', 'miya-mystic'],
                    hand: ['drawing-the-void']
                },
                player2: {
                    hand: ['regal-bearing', 'reprieve']
                }
            });

            this.akodoKaede = this.player1.findCardByName('akodo-kaede');
            this.drawingTheVoid = this.player1.findCardByName('drawing-the-void');

            this.regalBearing = this.player2.findCardByName('regal-bearing');
            this.reprieve = this.player2.findCardByName('reprieve');
        });

        it('reveals two cards and remove one from the game, with affinity the player chooses the card', function () {
            this.player1.clickCard(this.drawingTheVoid);
            expect(this.getChatLogs(5)).toContain(
                'player2 reveals Regal Bearing and Reprieve from their hand - the void reveals...'
            );
            expect(this.player1).toHavePrompt('Choose a card to remove from the game');
            expect(this.player1).toHavePromptButton('Regal Bearing');
            expect(this.player1).toHavePromptButton('Reprieve');

            this.player1.clickPrompt('Regal Bearing');
            expect(this.getChatLogs(5)).toContain('player1 removes Regal Bearing from the game - the void consumes!');
            expect(this.regalBearing.location).toBe('removed from game');

            expect(this.player2).toHavePrompt('Initiate an action');
        });

        it('reveals two cards and remove one from the game, without affinity the opponent chooses the card', function () {
            this.player1.moveCard(this.akodoKaede, 'dynasty deck');

            this.player1.clickCard(this.drawingTheVoid);
            expect(this.getChatLogs(5)).toContain(
                'player2 reveals Regal Bearing and Reprieve from their hand - the void reveals...'
            );
            expect(this.player2).toHavePrompt('Choose a card to remove from the game');
            expect(this.player2).toHavePromptButton('Regal Bearing');
            expect(this.player2).toHavePromptButton('Reprieve');

            this.player2.clickPrompt('Regal Bearing');
            expect(this.getChatLogs(5)).toContain('player2 removes Regal Bearing from the game - the void consumes!');
            expect(this.regalBearing.location).toBe('removed from game');

            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });
});