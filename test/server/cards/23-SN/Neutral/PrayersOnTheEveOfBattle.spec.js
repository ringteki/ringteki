describe('Prayers on the Eve of Battle', function () {
    integration(function () {
        describe('Return to hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki'],
                        hand: ['against-the-waves']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        conflictDiscard: ['prayers-on-the-eve-of-battle', 'prayers-on-the-eve-of-battle']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.borderlands = this.player2.findCardByName('borderlands-defender');

                this.atw = this.player1.findCardByName('against-the-waves');
                this.prayers1 = this.player2.filterCardsByName('prayers-on-the-eve-of-battle')[0];
                this.prayers2 = this.player2.filterCardsByName('prayers-on-the-eve-of-battle')[1];
            });

            it('should return to hand if opponent passes with a ready character', function () {
                this.noMoreActions();
                this.player1.passConflict();
                expect(this.player2).toHavePrompt('Triggered abilities');
                expect(this.player2).toBeAbleToSelect(this.prayers1);
                expect(this.player2).toBeAbleToSelect(this.prayers2);
                this.player2.clickCard(this.prayers1);

                expect(this.prayers1.location).toBe('hand');
                expect(this.player1).toHavePrompt('Action Window');

                expect(this.getChatLogs(5)).toContain('player2 uses Prayers on the Eve of Battle to move Prayers on the Eve of Battle to player2\'s hand');
            });

            it('should not trigger if opponent passes with no ready characters', function () {
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');
            });

            it('should not prompt you if you pass with ready characters', function () {
                this.player1.clickCard(this.atw);
                this.player1.clickCard(this.asakoTsuki);
                this.noMoreActions();
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
                expect(this.player2).not.toHavePrompt('Triggered abilities');

                this.noMoreActions();
                this.player2.passConflict();

                expect(this.player2).not.toHavePrompt('Triggered abilities');
            });
        });

        describe('Trigger', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-tsuki'],
                        hand: ['prayers-on-the-eve-of-battle']
                    },
                    player2: {
                        inPlay: ['borderlands-defender'],
                        hand: ['prayers-on-the-eve-of-battle']
                    }
                });
                this.asakoTsuki = this.player1.findCardByName('asako-tsuki');
                this.borderlands = this.player2.findCardByName('borderlands-defender');

                this.prayers1 = this.player1.findCardByName('prayers-on-the-eve-of-battle');
                this.prayers2 = this.player2.findCardByName('prayers-on-the-eve-of-battle');

                this.player1.playAttachment(this.prayers1, this.asakoTsuki);
                this.player2.playAttachment(this.prayers2, this.borderlands);
            });

            it('happy path', function () {
                let fate = this.player1.fate;
                let fate2 = this.player2.fate;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.asakoTsuki],
                    defenders: [this.borderlands],
                });

                this.noMoreActions();
                expect(this.player1.fate).toBe(fate);
                expect(this.player2.fate).toBe(fate2 + 1);

                expect(this.prayers1.location).toBe('removed from game');
                expect(this.prayers2.location).toBe('conflict discard pile');

                expect(this.getChatLogs(10)).toContain('player1 uses Prayers on the Eve of Battle to remove Prayers on the Eve of Battle from the game');
                expect(this.getChatLogs(10)).toContain('player2 uses Prayers on the Eve of Battle to gain 1 fate and discard Prayers on the Eve of Battle');
            });
        });
    });
});
