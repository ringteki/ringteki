describe('Mioko\'s Song', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'doji-kuwanan', 'doji-whisperer'],
                    hand: ['festival-for-the-fortunes', 'way-of-the-crane'],
                    stronghold: ['mioko-s-song'],
                    dynastyDiscard: ['favorable-ground']
                },
                player2: {
                    inPlay: ['savvy-politician'],
                    hand: ['assassination']
                }
            });

            this.sh = this.player1.findCardByName('mioko-s-song');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.ground = this.player1.findCardByName('favorable-ground');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.festival = this.player1.findCardByName('festival-for-the-fortunes');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.savvy = this.player2.findCardByName('savvy-politician');

            this.player1.placeCardInProvince(this.ground, 'province 1');
            this.assassination = this.player2.findCardByName('assassination');
        });

        it('should dishonor someone to reduce the cost of the next event by 1 fate', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.sh);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);

            this.player2.pass();
            this.player1.clickCard(this.festival);
            expect(this.player1.fate).toBe(fate - 2);
        });

        it('should dishonor someone to reduce the cost of the next event by 1 fate', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.sh);
            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.isDishonored).toBe(true);

            this.player2.pass();
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.whisperer);

            this.player2.pass();
            this.player1.clickCard(this.festival);
            expect(this.player1.fate).toBe(fate - 3);
        });

        it('should give target Courtesy', function() {
            let fate = this.player1.fate;
            this.player1.clickCard(this.sh);
            this.player1.clickCard(this.whisperer);

            expect(this.whisperer.isDishonored).toBe(true);
            expect(this.whisperer.hasKeyword('courtesy')).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Mioko\'s Song, bowing Mioko\'s Song and dishonoring Doji Whisperer to reduce the cost of their next event this phase by 1 and give Doji Whisperer Courtesy until the end of the round');

            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.whisperer],
                defenders: []
            });
            this.player2.clickCard(this.assassination);
            this.player2.clickCard(this.whisperer);
            expect(this.player1.fate).toBe(fate + 1);
            expect(this.getChatLogs(5)).toContain('player1 gains a fate due to Doji Whisperer\'s Courtesy');
        });
    });
});
