describe('Under Siege', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['tattooed-wanderer'],
                    hand: ['fine-katana', 'under-siege'],
                    conflictDiscard: ['for-shame', 'way-of-the-dragon', 'court-games', 'assassination', 'way-of-the-crane', 'backhanded-compliment']
                },
                player2: {
                    inPlay: ['shrine-maiden'],
                    hand: ['ornate-fan'],
                    conflictDiscard: ['for-shame', 'way-of-the-dragon', 'court-games', 'assassination', 'way-of-the-crane', 'backhanded-compliment'],
                    dynastyDiscard: ['chukan-nobue']
                }
            });

            this.wanderer = this.player1.findCardByName('tattooed-wanderer');
            this.siege = this.player1.findCardByName('under-siege');
            this.maiden = this.player2.findCardByName('shrine-maiden');

            this.katana = this.player1.findCardByName('fine-katana');
            this.nobue = this.player2.findCardByName('chukan-nobue');

            this.player2.reduceDeckToNumber('conflict deck', 0);
            this.fan = this.player2.findCardByName('ornate-fan');
            this.shame = this.player2.moveCard('for-shame', 'conflict deck');
            this.bhc = this.player2.moveCard('backhanded-compliment', 'conflict deck');
            this.dragon = this.player2.moveCard('way-of-the-dragon', 'conflict deck');
            this.courtGames = this.player2.moveCard('court-games', 'conflict deck');
            this.assassination = this.player2.moveCard('assassination', 'conflict deck');
            this.crane = this.player2.moveCard('way-of-the-crane', 'conflict deck');

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.katana = this.player1.findCardByName('fine-katana');
            this.shame2 = this.player1.moveCard('for-shame', 'conflict deck');
            this.bhc2 = this.player1.moveCard('backhanded-compliment', 'conflict deck');
            this.dragon2 = this.player1.moveCard('way-of-the-dragon', 'conflict deck');
            this.courtGames2 = this.player1.moveCard('court-games', 'conflict deck');
            this.assassination2 = this.player1.moveCard('assassination', 'conflict deck');
            this.crane2 = this.player1.moveCard('way-of-the-crane', 'conflict deck');

            this.noMoreActions();
        });

        it('should trigger when an attack is declared', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.siege);
        });

        it('should remove the defenders hand from the game and draw 5 cards', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            expect(this.fan.location).toBe('removed from game');
            expect(this.bhc.location).toBe('hand');
            expect(this.dragon.location).toBe('hand');
            expect(this.courtGames.location).toBe('hand');
            expect(this.assassination.location).toBe('hand');
            expect(this.crane.location).toBe('hand');
            expect(this.shame.location).toBe('conflict deck');
        });

        it('at the end of the conflict should discard the hand and put the removed from game cards back', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');

            expect(this.fan.location).toBe('hand');
            expect(this.bhc.location).toBe('conflict discard pile');
            expect(this.dragon.location).toBe('conflict discard pile');
            expect(this.courtGames.location).toBe('conflict discard pile');
            expect(this.assassination.location).toBe('conflict discard pile');
            expect(this.crane.location).toBe('conflict discard pile');
            expect(this.shame.location).toBe('conflict deck');
            expect(this.player2.hand.length).toBe(1);
            expect(this.katana.location).toBe('hand');
        });

        it('should discard any cards drawn during the conflict', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');

            this.player2.clickCard(this.bhc);
            this.player2.clickPrompt('player2');
            expect(this.shame.location).toBe('hand');
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');

            expect(this.shame.location).toBe('conflict discard pile');
        });

        it('should not discard cards that were played during the conflict', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');

            this.player2.playAttachment(this.dragon, this.maiden);
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.dragon.location).toBe('play area');
        });

        it('should not draw cards if the defending player is empty', function() {
            this.player2.moveCard(this.fan, 'conflict discard pile');

            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');

            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.bhc.location).toBe('conflict deck');
            expect(this.dragon.location).toBe('conflict deck');
            expect(this.courtGames.location).toBe('conflict deck');
            expect(this.assassination.location).toBe('conflict deck');
            expect(this.crane.location).toBe('conflict deck');
            expect(this.shame.location).toBe('conflict deck');
        });

        it('should still discard the hand at the end of the conflict even if you didn\'t draw any cards', function() {
            this.player2.moveCard(this.fan, 'conflict discard pile');

            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');

            this.player2.moveCard(this.bhc, 'hand');
            this.player2.moveCard(this.dragon, 'hand');

            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');

            expect(this.fan.location).toBe('conflict discard pile');
            expect(this.bhc.location).toBe('conflict discard pile');
            expect(this.dragon.location).toBe('conflict discard pile');
            expect(this.courtGames.location).toBe('conflict deck');
            expect(this.assassination.location).toBe('conflict deck');
            expect(this.crane.location).toBe('conflict deck');
            expect(this.shame.location).toBe('conflict deck');
        });

        it('should remove the defenders hand from the game and draw 5 cards (Self defending)', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.maiden]
            });
            this.player1.clickCard(this.siege);
            expect(this.katana.location).toBe('removed from game');
            expect(this.bhc2.location).toBe('hand');
            expect(this.dragon2.location).toBe('hand');
            expect(this.courtGames2.location).toBe('hand');
            expect(this.assassination2.location).toBe('hand');
            expect(this.crane2.location).toBe('hand');
            expect(this.shame2.location).toBe('conflict deck');

            this.player1.clickPrompt('Done');
            this.noMoreActions();
            this.player2.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');

            expect(this.katana.location).toBe('hand');
            expect(this.bhc2.location).toBe('conflict discard pile');
            expect(this.dragon2.location).toBe('conflict discard pile');
            expect(this.courtGames2.location).toBe('conflict discard pile');
            expect(this.assassination2.location).toBe('conflict discard pile');
            expect(this.crane2.location).toBe('conflict discard pile');
            expect(this.shame2.location).toBe('conflict deck');
            expect(this.player1.hand.length).toBe(1);
            expect(this.fan.location).toBe('hand');
        });

        it('chat messages', function() {
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.getChatLogs(20)).toContain('player1 plays Under Siege to place player2 under siege!');
            expect(this.getChatLogs(20)).toContain('player2 sets their hand aside and draws 5 cards');
            expect(this.getChatLogs(20)).toContain('player2 discards Way of the Crane, Assassination, Court Games, Way of the Dragon and Backhanded Compliment');
            expect(this.getChatLogs(20)).toContain('player2 picks up their original hand');
        });

        it('Chukan Nobu interaction - should not discard any cards post conflict', function() {
            this.player2.moveCard(this.nobue, 'play area');
            this.game.checkGameState(true);
            this.initiateConflict({
                attackers: [this.wanderer]
            });
            expect(this.fan.location).toBe('hand');
            this.player1.clickCard(this.siege);
            this.player2.clickPrompt('Done');
            expect(this.fan.location).toBe('removed from game');

            this.player2.clickCard(this.bhc);
            this.player2.clickPrompt('player2');
            expect(this.shame.location).toBe('hand');
            this.noMoreActions();
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1).toHavePrompt('Action Window');

            expect(this.shame.location).toBe('hand');
            expect(this.fan.location).toBe('hand');
        });
    });
});
