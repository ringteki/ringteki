describe('A Cleansing Death', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['togashi-yokuni', 'doji-challenger'],
                    dynastyDeck: ['togashi-mitsu', 'mischievous-tanuki', 'doji-whisperer'],
                    hand: ['a-cleansing-death']
                },
                player2: {
                    dynastyDeck: ['doji-diplomat']
                }
            });
            this.mitsu = this.player1.placeCardInProvince('togashi-mitsu', 'province 1');
            this.tanuki = this.player1.placeCardInProvince('mischievous-tanuki', 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 3');

            const adepts = this.player1.filterCardsByName(fillers.dynasty);
            adepts.forEach(card => {
                card.facedown = true;
            });

            this.diplomat = this.player2.placeCardInProvince('doji-diplomat', 'province 1');

            this.yokuni = this.player1.findCardByName('togashi-yokuni');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.cleanse = this.player1.findCardByName('a-cleansing-death');


            this.mitsu.facedown = false;
            this.tanuki.facedown = false;
            this.whisperer.facedown = false;
            this.diplomat.facedown = false;
        });

        it('should let you pick a valid character', function () {
            let honor = this.player1.honor;
            this.player1.clickCard(this.cleanse);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.yokuni);
            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.tanuki);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.diplomat);

            this.player1.clickCard(this.whisperer);
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.whisperer.location).toBe('play area');
            expect(this.player1.honor).toBe(honor + 1);
            expect(this.getChatLogs(5)).toContain('player1 plays A Cleansing Death, sacrificing Doji Challenger to put Doji Whisperer into play and gain 1 honor');
        });

        it('cannot sacrifice without valid targets', function () {
            this.whisperer.facedown = true;
            this.game.checkGameState(true);

            this.player1.clickCard(this.cleanse);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.yokuni);
        });

        it('puts into play at home even during a conflict', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yokuni],
                defenders: []
            });

            this.player2.pass();

            this.player1.clickCard(this.cleanse);
            this.player1.clickCard(this.yokuni);
            this.player1.clickCard(this.mitsu);
            expect(this.yokuni.location).toBe('dynasty discard pile');
            expect(this.mitsu.location).toBe('play area');
            expect(this.mitsu.isParticipating()).toBe(false);
        });
    });
});
