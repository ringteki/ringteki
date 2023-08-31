describe('Chronicler of Calamities', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['shiba-tsukune', 'doomed-shugenja', 'bayushi-manipulator']
                },
                player2: {
                    inPlay: ['chronicler-of-calamities', 'solemn-scholar']
                }
            });

            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.manipulator = this.player1.findCardByName('bayushi-manipulator');
            this.manipulator.dishonor();

            this.chronicler = this.player2.findCardByName('chronicler-of-calamities');
            this.scholar = this.player2.findCardByName('solemn-scholar');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tsukune, this.doomed, this.manipulator],
                defenders: [this.chronicler, this.scholar]
            });
        });

        it('Without sacrifice does one', function () {
            this.player2.clickCard(this.chronicler);
            expect(this.player2).toHavePrompt('Pay optional cost?');

            this.player2.clickPrompt('No');

            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.tsukune);
            expect(this.player2).toBeAbleToSelect(this.doomed);
            expect(this.player2).toBeAbleToSelect(this.manipulator);
            this.player2.clickCard(this.doomed);

            expect(this.player2).toHavePrompt('Select one');
            expect(this.player2).toHavePromptButton('Move it home');
            expect(this.player2).toHavePromptButton('Dishonor it');
            this.player2.clickPrompt('Move it home');
            expect(this.getChatLogs(5)).toContain('player2 uses Chronicler of Calamities to send Doomed Shugenja home');
        });

        it('With sacrifice does both', function () {
            this.player2.clickCard(this.chronicler);
            expect(this.player2).toHavePrompt('Pay optional cost?');

            this.player2.clickPrompt('Yes');
            expect(this.player2).toHavePrompt('Select card to sacrifice');
            expect(this.player2).toBeAbleToSelect(this.scholar);
            expect(this.player2).toBeAbleToSelect(this.chronicler);
            this.player2.clickCard(this.scholar);

            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).not.toBeAbleToSelect(this.tsukune);
            expect(this.player2).toBeAbleToSelect(this.doomed);
            expect(this.player2).toBeAbleToSelect(this.manipulator);
            this.player2.clickCard(this.doomed);

            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.player2).not.toHavePromptButton('Move it home');
            expect(this.player2).not.toHavePromptButton('Dishonor it');
            expect(this.getChatLogs(5)).toContain(
                'player2 uses Chronicler of Calamities, sacrificing true to send Doomed Shugenja home and dishonor Doomed Shugenja'
            );
        });
    });
});
