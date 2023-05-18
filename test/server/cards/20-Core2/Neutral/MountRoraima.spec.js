describe('Mount Roraima', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'worldly-shiotome', 'utaku-tetsuko']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni'],
                    provinces: ['mount-roraima']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.wordlyShiotome = this.player1.findCardByName('worldly-shiotome');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');

            this.mountRoraima = this.player2.findCardByName('mount-roraima', 'province 1');
        });

        it('bows all character that cost 2 or less', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                province: this.mountRoraima
            });

            expect(this.player2).toHavePrompt('Any reactions?');
            this.player2.clickCard(this.mountRoraima);

            expect(this.aggressiveMoto.bowed).toBe(true);
            expect(this.wordlyShiotome.bowed).toBe(true);
            expect(this.initiate.bowed).toBe(true);
            expect(this.tetsuko.bowed).toBe(false);
            expect(this.yokuni.bowed).toBe(false);

            expect(this.getChatLogs(3)).toContain(
                'player2 uses Mount Roraima to bow Aggressive Moto, Worldly Shiotome and Togashi Initiate'
            );
        });
    });
});
