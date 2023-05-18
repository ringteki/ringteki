describe('Crystal Cave', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto', 'worldly-shiotome', 'utaku-tetsuko'],
                    hand: ['i-can-swim', 'way-of-the-scorpion']
                },
                player2: {
                    provinces: ['crystal-cave']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.wordlyShiotome = this.player1.findCardByName('worldly-shiotome');
            this.tetsuko = this.player1.findCardByName('utaku-tetsuko');

            this.crystalCave = this.player2.findCardByName('crystal-cave', 'province 1');
        });

        it('discards random cards from attacker hand', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto, this.wordlyShiotome],
                province: this.crystalCave
            });

            expect(this.player2).toHavePrompt('Any reactions?');

            this.player2.clickCard(this.crystalCave);
            expect(this.getChatLogs(3)).toContain(
                'player2 uses Crystal Cave to make player1 discard 2 cards at random'
            );
        });
    });
});
