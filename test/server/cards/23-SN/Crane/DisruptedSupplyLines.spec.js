describe('Disrupted Supply Lines', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-shadows', 'doji-diplomat'],
                    hand: ['disrupted-supply-lines', 'duelist-training']
                },
                player2: {
                    inPlay: ['moto-youth', 'doomed-shugenja'],
                    hand: ['ornate-fan', 'prepared-ambush', 'hidden-lineage']
                }
            });


            this.shadows = this.player1.findCardByName('adept-of-shadows');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.supply = this.player1.findCardByName('disrupted-supply-lines');
            this.training = this.player1.findCardByName('duelist-training');

            this.youth = this.player2.findCardByName('moto-youth');
            this.shugenja = this.player2.findCardByName('doomed-shugenja');
            this.fan = this.player2.findCardByName('ornate-fan');
            this.ambush = this.player2.findCardByName('prepared-ambush');
            this.lineage = this.player2.findCardByName('hidden-lineage');
            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
        });

        it('Dishonor shinobi and give fate', function () {
            let fate = this.player1.fate;
            let fate2 = this.player2.fate;
            this.player1.pass();
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.shugenja);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.supply);

            this.player1.clickCard(this.supply);

            expect(this.player1).toHavePrompt('Choose a character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.shadows);
            expect(this.player1).toBeAbleToSelect(this.diplomat);

            this.player1.clickCard(this.shadows);
            expect(this.player1.fate).toBe(fate);
            expect(this.shadows.isDishonored).toBe(true);

            expect(this.player2).toHavePrompt('Select one');
            expect(this.player2).toHavePromptButton('Give your opponent 1 fate');
            expect(this.player2).toHavePromptButton('Remove attachment from the game');
            this.player2.clickPrompt('Give your opponent 1 fate');

            expect(this.player1.fate).toBe(fate + 1);
            expect(this.player2.fate).toBe(fate2 - 1);

            expect(this.getChatLogs(10)).toContain('player1 plays Disrupted Supply Lines, dishonoring Adept of Shadows to take 1 fate from player2');
            expect(this.fan.location).toBe('play area');

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('Dishonor non-shinobi and remove from game', function () {
            let fate = this.player1.fate;
            let fate2 = this.player2.fate;

            this.player1.pass();
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.shugenja);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.supply);

            this.player1.clickCard(this.supply);

            expect(this.player1).toHavePrompt('Choose a character to dishonor');
            expect(this.player1).toBeAbleToSelect(this.shadows);
            expect(this.player1).toBeAbleToSelect(this.diplomat);

            this.player1.clickCard(this.diplomat);

            expect(this.player1.fate).toBe(fate - 1);
            expect(this.diplomat.isDishonored).toBe(true);

            expect(this.player2).toHavePrompt('Select one');
            expect(this.player2).toHavePromptButton('Give your opponent 1 fate');
            expect(this.player2).toHavePromptButton('Remove attachment from the game');
            this.player2.clickPrompt('Remove attachment from the game');

            expect(this.getChatLogs(10)).toContain('player1 plays Disrupted Supply Lines, dishonoring Doji Diplomat and paying 1 fate to remove Ornate Fan from the game');
            expect(this.fan.location).toBe('removed from game');
            expect(this.player1.fate).toBe(fate - 1);
            expect(this.player2.fate).toBe(fate2);

            expect(this.player1).toHavePrompt('Action Window');
        });

        it('No fate', function () {
            this.player2.fate = 0;
            this.player1.pass();
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.shugenja);
            this.player1.clickCard(this.supply);
            this.player1.clickCard(this.shadows);

            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.getChatLogs(10)).toContain('player1 plays Disrupted Supply Lines, dishonoring Adept of Shadows to remove Ornate Fan from the game');
            expect(this.fan.location).toBe('removed from game');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('Moving without playing', function () {
            this.player2.fate = 0;
            this.player1.pass();
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.shugenja);
            this.player1.pass();
            this.player1.pass();
            this.player2.clickCard(this.lineage);
            this.player2.clickCard(this.fan);
            this.player2.clickCard(this.youth);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.supply);
            this.player1.clickCard(this.supply);
            this.player1.clickCard(this.shadows);

            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.getChatLogs(10)).toContain('player1 plays Disrupted Supply Lines, dishonoring Adept of Shadows to remove Ornate Fan from the game');
            expect(this.fan.location).toBe('removed from game');
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('Province attachment', function () {
            this.player1.pass();
            this.player2.clickCard(this.ambush);
            this.player2.clickCard(this.sd1);

            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});