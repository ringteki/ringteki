describe('Mirumoto Avenger', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['doji-challenger', 'kakita-yoshi', 'daidoji-uji'],
                    hand: ['assassination']
                },
                player2: {
                    inPlay: ['mirumoto-avenger'],
                    hand: ['assassination']
                }
            });

            this.uji = this.player1.findCardByName('daidoji-uji');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.avenger = this.player2.findCardByName('mirumoto-avenger');
            this.assassination = this.player1.findCardByName('assassination');
            this.assassination2 = this.player2.findCardByName('assassination');

            this.yoshi.fate = 2;
        });

        it('should duel after being discarded by opponents card effects and discard the duel loser', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
            });

            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.avenger);

            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.avenger);

            this.player2.clickCard(this.avenger);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).toBeAbleToSelect(this.uji);

            this.player2.clickCard(this.yoshi);
            
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(10)).toContain('player2 uses Mirumoto Avenger to initiate a military duel : Mirumoto Avenger vs. Kakita Yoshi');
            expect(this.getChatLogs(10)).toContain('Mirumoto Avenger: 4 vs 3: Kakita Yoshi', 'Duel Effect: discard Kakita Yoshi');

            expect(this.yoshi.location).toBe('dynasty discard pile');
        });

        it('should not trigger if you kill yourself', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [],
            });

            this.player2.clickCard(this.assassination2);
            this.player2.clickCard(this.avenger);

            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});