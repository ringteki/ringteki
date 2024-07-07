describe('Supporting Cast', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    hand: ['assassination', 'tarnished-reputation'],
                    inPlay: ['matsu-berserker']
                },
                player2: {
                    hand: ['supporting-cast'],
                    inPlay: ['shosuro-sadako', 'bayushi-manipulator']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.assassination = this.player1.findCardByName('assassination');
            this.tarReputation = this.player1.findCardByName('tarnished-reputation');

            this.supportingCast = this.player2.findCardByName('supporting-cast');
            this.shosuroSadako = this.player2.findCardByName('shosuro-sadako');
            this.bayushiManipulator = this.player2.findCardByName('bayushi-manipulator');

            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.matsuBerserker],
                defenders: [this.bayushiManipulator, this.shosuroSadako]
            });
        });

        it('gives a military bonus to another character', function () {
            this.player2.pass();
            this.player1.clickCard(this.assassination);
            this.player1.clickCard(this.shosuroSadako);

            expect(this.shosuroSadako.location).toBe('conflict discard pile');
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.supportingCast);

            expect(this.player2).toHavePrompt('Choose a character to give +3 military skill');
            this.player2.clickCard(this.bayushiManipulator);
            expect(this.getChatLogs(5)).toContain(
                'player2 plays Supporting Cast to give +3 military skill to Bayushi Manipulator - Shosuro Sadako was just a distraction!'
            );
        });

        it('gives a military bonus to another character, bowing the first', function () {
            this.player2.pass();
            this.player1.clickCard(this.tarReputation);
            this.player1.clickCard(this.shosuroSadako);

            expect(this.shosuroSadako.bowed).toBe(false);
            expect(this.shosuroSadako.isDishonored).toBe(true);
            expect(this.player2).toHavePrompt('Triggered Abilities');
            this.player2.clickCard(this.supportingCast);

            expect(this.player2).toHavePrompt('Choose a character to give +3 military skill');
            this.player2.clickCard(this.bayushiManipulator);

            expect(this.shosuroSadako.bowed).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                'player2 plays Supporting Cast to give +3 military skill to Bayushi Manipulator - Shosuro Sadako was just a distraction!'
            );
        });
    });
});
