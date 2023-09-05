xdescribe('Antelope Canyon', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aggressive-moto'],
                    hand: ['i-can-swim', 'way-of-the-scorpion']
                },
                player2: {
                    inPlay: ['togashi-initiate', 'togashi-yokuni', 'doomed-shugenja'],
                    provinces: ['antelope-canyon']
                }
            });

            this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
            this.swim = this.player1.findCardByName('i-can-swim');
            this.scorpion = this.player1.findCardByName('way-of-the-scorpion');

            this.initiate = this.player2.findCardByName('togashi-initiate');
            this.yokuni = this.player2.findCardByName('togashi-yokuni');
            this.doomed = this.player2.findCardByName('doomed-shugenja');

            this.antelopeCanyon = this.player2.findCardByName('antelope-canyon', 'province 1');
        });

        it("reveals random cards from opponent's hand", function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.aggressiveMoto],
                defenders: [this.yokuni, this.initiate],
                province: this.antelopeCanyon
            });

            this.player2.clickCard(this.antelopeCanyon);
            expect(this.player2).toBeAbleToSelect(this.yokuni);
            expect(this.player2).toBeAbleToSelect(this.initiate);
            expect(this.player2).not.toBeAbleToSelect(this.doomed);
            expect(this.player2).not.toBeAbleToSelect(this.aggressiveMoto);

            this.player2.clickCard(this.yokuni);
            expect(this.getChatLogs(3)).toContain(
                'player2 uses Antelope Canyon with Togashi Yokuni. It reveals I Can Swim and Way of the Scorpion'
            );
        });
    });
});
