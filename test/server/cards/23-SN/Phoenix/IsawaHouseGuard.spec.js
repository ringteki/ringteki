describe('Isawa House Guard', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['doji-challenger', 'doji-whisperer', 'kakita-yoshi'],
                    hand: ['a-fate-worse-than-death', 'desolation'],
                    dynastyDiscard: ['awakened-tsukumogami', 'promising-kohai']
                },
                player2: {
                    inPlay: ['isawa-house-guard', 'kakita-toshimoko'],
                    hand: ['embrace-the-void', 'policy-debate']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.student = this.player1.findCardByName('promising-kohai');
            this.house = this.player2.findCardByName('isawa-house-guard');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.pd = this.player2.findCardByName('policy-debate');
            this.yoshi.fate = 1;
        });

        it('no refusal - should duel and dishonor loser', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.house]
            });

            this.player2.clickCard(this.house);
            this.player2.clickCard(this.yoshi);

            expect(this.getChatLogs(5)).toContain(
                'player2 uses Isawa House Guard to initiate a military duel : Isawa House Guard vs. Kakita Yoshi'
            );
            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.getChatLogs(10)).toContain('Duel Effect: Kakita Yoshi is dishonored and injured if tainted');
            expect(this.yoshi.isDishonored).toBe(true);
            expect(this.yoshi.fate).toBe(1);
        });

        it('duel focus', function () {
            this.house.honor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.house]
            });

            this.player2.clickCard(this.house);
            this.player2.clickCard(this.yoshi);

            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player2).toBeAbleToSelect(this.house);
            this.player2.clickCard(this.house);

            expect(this.getChatLogs(10)).toContain('player2 uses Isawa House Guard to add 1 to their duel total');

            expect(this.getChatLogs(10)).toContain('Isawa House Guard: 7 vs 3: Kakita Yoshi');
            expect(this.getChatLogs(10)).toContain('Duel Effect: Kakita Yoshi is dishonored and injured if tainted');
        });

        it('injure as well', function () {
            this.yoshi.taint();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [this.house]
            });

            this.player2.clickCard(this.house);
            this.player2.clickCard(this.yoshi);

            expect(this.getChatLogs(5)).toContain(
                'player2 uses Isawa House Guard to initiate a military duel : Isawa House Guard vs. Kakita Yoshi'
            );
            expect(this.player1).toHavePrompt('Honor Bid');
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('5');

            expect(this.getChatLogs(10)).toContain('Duel Effect: Kakita Yoshi is dishonored and injured if tainted');
            expect(this.yoshi.isDishonored).toBe(true);
            expect(this.yoshi.fate).toBe(0);
        });
    });
});
