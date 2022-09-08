fdescribe('Master of the Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade'],
                    hand: ['fine-katana', 'dragon-s-fang', 'dragon-s-claw'],
                    conflictDeck: ['pathfinder-s-blade', 'honored-blade', 'mantra-of-fire', 'censure', 'ornate-fan']
                }
            });

            this.masterOfTheBlade = this.player1.findCardByName('master-of-the-blade');

            this.dragonsClaw = this.player1.findCardByName('dragon-s-claw');
            this.dragonsFang = this.player1.findCardByName('dragon-s-fang');
            this.fineKatana = this.player1.findCardByName('fine-katana');

            this.pathfindersBlade = this.player1.findCardByName('pathfinder-s-blade');
            this.honoredBlade = this.player1.findCardByName('honored-blade');
        });

        it('should not trigger on attaching a fine katana', function() {
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            expect(this.player2).toHavePrompt('Action Window');
        });

        it('should trigger on attaching a 1 cost weapon (dragons fang) and allow you to get a 0 cost weapon', function() {
            this.player1.clickCard(this.dragonsFang);
            this.player1.clickCard(this.masterOfTheBlade);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.masterOfTheBlade);

            this.player1.clickCard(this.masterOfTheBlade);
            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Pathfinder\'s Blade');
            expect(this.player1).toHaveDisabledPromptButton('Honored Blade');
            expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');

            this.player1.clickPrompt('Pathfinder\'s Blade');
            expect(this.pathfindersBlade.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player1 uses Master of the Blade to look at the top 8 cards of their deck');
            expect(this.getChatLogs(3)).toContain('player1 takes Pathfinder\'s Blade');
        });

        it('should trigger on attaching a 2 cost weapon (dragons claw) and allow you to get a 1 or lower cost weapon', function() {
            this.player1.clickCard(this.dragonsClaw);
            this.player1.clickCard(this.masterOfTheBlade);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.masterOfTheBlade);

            this.player1.clickCard(this.masterOfTheBlade);
            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Pathfinder\'s Blade');
            expect(this.player1).toHavePromptButton('Honored Blade');
            expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');

            this.player1.clickPrompt('Honored Blade');
            expect(this.honoredBlade.location).toBe('hand');
            expect(this.getChatLogs(3)).toContain('player1 uses Master of the Blade to look at the top 8 cards of their deck');
            expect(this.getChatLogs(3)).toContain('player1 takes Honored Blade');
        });

        it('should allow you to take nothing', function() {
            this.player1.clickCard(this.dragonsClaw);
            this.player1.clickCard(this.masterOfTheBlade);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.masterOfTheBlade);

            this.player1.clickCard(this.masterOfTheBlade);
            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Pathfinder\'s Blade');
            expect(this.player1).toHavePromptButton('Honored Blade');
            expect(this.player1).toHavePromptButton('Take nothing');
            expect(this.player1).toHaveDisabledPromptButton('Mantra of Fire');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');

            this.player1.clickPrompt('Take nothing');
            expect(this.getChatLogs(3)).toContain('player1 takes nothing');
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
