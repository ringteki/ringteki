describe('Heart Attack Grill', function () {
    integration(function () {
        describe('feeding an army interaction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        provinces: ['heart-attack-grill'],
                        inPlay: ['doji-challenger'],
                        hand: ['feeding-an-army']
                    },
                    player2: {
                        inPlay: ['aggressive-moto']
                    }
                });

                this.feedingAnArmy = this.player1.findCardByName('feeding-an-army');
                this.heartAttackGrill = this.player1.findCardByName('heart-attack-grill', 'province 1');
                this.heartAttackGrill.facedown = false;

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('does not trigger if the province is broken outside a conflict', function () {
                this.noMoreActions();
                this.player1.clickCard(this.feedingAnArmy);
                this.player1.clickCard(this.heartAttackGrill);
                expect(this.player1).not.toHavePrompt('Any interrupts?');
            });
        });

        describe('when it triggers', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['aggressive-moto'],
                        hand: ['ornate-fan']
                    },
                    player2: {
                        provinces: ['heart-attack-grill']
                    }
                });

                this.aggressiveMoto = this.player1.findCardByName('aggressive-moto');
                this.fan = this.player1.findCardByName('ornate-fan');
                this.player1.moveCard(this.fan, 'conflict deck');

                this.heartAttackGrill = this.player2.findCardByName('heart-attack-grill', 'province 1');
            });

            it('looks at attacker\'s deck and remove from the game up to 3 cards', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.aggressiveMoto],
                    defenders: [],
                    type: 'military',
                    province: this.heartAttackGrill
                });

                this.noMoreActions();
                expect(this.player2).toHavePrompt('Any interrupts?');

                this.player2.clickCard(this.heartAttackGrill);
                expect(this.player2).toHavePrompt('Select a card to remove from the game (0 of 3)');
                expect(this.player2).toHavePromptButton('Ornate Fan');
                expect(this.player2).toHavePromptButton('Supernatural Storm (7)');
                this.player2.clickPrompt('Supernatural Storm (7)');
                expect(this.player2).toHavePrompt('Select a card to remove from the game (1 of 3)');
                this.player2.clickPrompt('Supernatural Storm (6)');
                expect(this.player2).toHavePrompt('Select a card to remove from the game (2 of 3)');
                this.player2.clickPrompt('Supernatural Storm (5)');

                expect(this.player1.conflictDeck[0]).toBe(this.fan);
                expect(this.getChatLogs(5)).toContain('player2 uses Heart Attack Grill');
                expect(this.getChatLogs(5)).toContain(
                    'player2 remove Supernatural Storm, Supernatural Storm and Supernatural Storm from the game'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player2 returns the other cards to the top of player1 deck in the same order'
                );
            });
        });
    });
});
