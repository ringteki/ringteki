describe('Fields of Rolling Thunder', function () {
    integration(function () {
        describe('honoring ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['border-rider', 'doji-whisperer'],
                        dynastyDiscard: ['fields-of-rolling-thunder']
                    }
                });

                this.fields = this.player1.findCardByName('fields-of-rolling-thunder');
                this.whisperer = this.player1.findCardByName('doji-whisperer');
                this.rider = this.player1.findCardByName('border-rider');
                this.player1.moveCard(this.fields, 'province 1');
            });

            it('if you have a ring should let you choose and honor a unicorn character', function () {
                this.player1.claimRing('water');
                this.player1.clickCard(this.fields);
                expect(this.player1).toBeAbleToSelect(this.rider);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);

                this.player1.clickCard(this.rider);
                expect(this.rider.isHonored).toBe(true);
                expect(this.getChatLogs(1)).toContain('player1 uses Fields of Rolling Thunder to honor Border Rider');
            });

            it('should not trigger if you don\'t have a ring', function () {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.fields);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('unopposed reaction', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar']
                    },
                    player2: {
                        inPlay: [],
                        dynastyDiscard: ['fields-of-rolling-thunder']
                    }
                });

                this.solemn = this.player1.findCardByName('solemn-scholar');

                this.fields = this.player2.findCardByName('fields-of-rolling-thunder');
                this.player2.moveCard(this.fields, 'province 1');
                this.fields.facedown = false;
            });

            it('discards itself after losing unopposed conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.solemn],
                    defenders: [],
                    type: 'political',
                    ring: 'void'
                });

                expect(this.fields.location).toBe('province 1');

                this.noMoreActions();
                expect(this.fields.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain(
                    'player2 uses Fields of Rolling Thunder to discard Fields of Rolling Thunder'
                );
            });

            it('when facedown does not discards itself after losing unopposed conflict', function () {
                this.fields.facedown = true;
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.solemn],
                    defenders: [],
                    type: 'political',
                    ring: 'void'
                });

                expect(this.fields.location).toBe('province 1');
                this.noMoreActions();

                expect(this.fields.location).toBe('province 1');
                expect(this.getChatLogs(5)).not.toContain(
                    'player2 uses Fields of Rolling Thunder to discard Fields of Rolling Thunder'
                );
            });
        });
    });
});
