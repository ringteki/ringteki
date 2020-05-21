describe('Skirmish Ring Effects', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['eager-scout', 'doji-whisperer'],
                    hand: ['assassination']
                },
                player2: {
                    inPlay: ['matsu-tsuko-2', 'akodo-toturi'],
                    hand: ['let-go']
                },
                skirmish: true
            });

            this.scout = this.player1.findCardByName('eager-scout');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.tsuko = this.player2.findCardByName('matsu-tsuko-2');
            this.toturi = this.player2.findCardByName('akodo-toturi');
            this.whisperer.bowed = true;
            this.tsuko.bowed = true;

            this.whisperer.fate = 1;
            this.tsuko.fate = 2;
            this.toturi.fate = 0;
        });

        it('Should have 3 strength', function () {
            this.player1.player.imperialFavor = 'both';
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.scout],
                defenders: [],
                ring: 'water'
            });
            this.noMoreActions();
            
            expect(this.player1).not.toBeAbleToSelect(this.scout);
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            expect(this.player1).not.toBeAbleToSelect(this.tsuko);
            expect(this.player1).toBeAbleToSelect(this.toturi);

            expect(this.toturi.bowed).toBe(false);
            this.player1.clickCard(this.toturi);
            expect(this.toturi.bowed).toBe(true);
        });

        it('Should have no elements', function () {

        });

        it('Should not be face up or face down', function () {

        });

        it('Should not reveal when attacked', function () {

        });
    });
});