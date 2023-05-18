describe('Kayabukiya Tavern', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto']
                },
                player2: {
                    inPlay: ['togashi-yokuni'],
                    provinces: ['kayabukiya-tavern']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
            this.tavern = this.player2.findCardByName('kayabukiya-tavern', 'province 1');
        });

        it('resolves the conflict element when winning on defense', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni],
                ring: 'earth',
                province: this.tavern
            });

            this.noMoreActions();
            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.tavern);
            expect(this.getChatLogs(3)).toContain('player2 uses Kayabukiya Tavern to resolve Earth Ring');
        });
    });
});
