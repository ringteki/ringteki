describe('Kagi Nawa', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['moto-nergui'],
                    hand: ['long-journey-home']
                },
                player2: {
                    inPlay: ['doji-challenger'],
                    hand: ['the-mountain-does-not-fall', 'ready-for-battle']
                }
            });
            this.motoNergui = this.player1.findCardByName('moto-nergui');
            this.longJourneyHome = this.player1.findCardByName('long-journey-home');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.mountain = this.player2.findCardByName('the-mountain-does-not-fall');
            this.readyForBattle = this.player2.findCardByName('ready-for-battle');
        });

        it('should trigger on moving home by an effect and bow the character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoNergui],
                defenders: [this.challenger],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.motoNergui);
            this.player1.clickCard(this.challenger);

            expect(this.challenger.location).toBe('play area');
            expect(this.challenger.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.longJourneyHome);

            this.player1.clickCard(this.longJourneyHome);
            expect(this.getChatLogs(3)).toContain('player1 plays Long Journey Home to make Doji Challenger take the long way home. Doji Challenger is bowed and cannot ready until the end of the phase');
            expect(this.challenger.bowed).toBe(true);
        });

        it('should prevent the controller of affected character from readying it.', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoNergui],
                defenders: [this.challenger],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.motoNergui);
            this.player1.clickCard(this.challenger);

            this.player1.clickCard(this.longJourneyHome);
            expect(this.challenger.bowed).toBe(true);
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should trigger on moving home by the end of a conflict and bow the character', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.motoNergui],
                defenders: [this.challenger],
                type: 'military'
            });

            this.player2.clickCard(this.mountain);
            this.player2.clickCard(this.challenger);
            this.player1.pass();
            this.player2.pass();

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.longJourneyHome);

            this.player1.clickCard(this.longJourneyHome);
            this.player1.clickCard(this.challenger);

            expect(this.getChatLogs(5)).toContain('player1 plays Long Journey Home to make Doji Challenger take the long way home. Doji Challenger is bowed and cannot ready until the end of the phase');
            expect(this.challenger.location).toBe('play area');
            expect(this.challenger.bowed).toBe(true);
        });
    });
});
