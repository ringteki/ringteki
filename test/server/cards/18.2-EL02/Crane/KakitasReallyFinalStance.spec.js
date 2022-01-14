describe('Kakitas Really Final Stance', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor:10,
                    inPlay: ['vice-proprietor'],
                    hand: ['a-new-name']
                },
                player2: {
                    honor:14,
                    inPlay: ['kakita-yoshi', 'doji-challenger'],
                    hand: ['kakita-s-really-really-final-stance']
                }
            });

            this.vice = this.player1.findCardByName('vice-proprietor');
            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.stance = this.player2.findCardByName('kakita-s-really-really-final-stance');
        });

        it('should not work in a pol conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi],
                type: 'political'
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.stance);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should prevent bowing at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.challenger],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.yoshi);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s Really Really Final Stance to stop Kakita Yoshi from bowing during conflict resolution');
            this.noMoreActions();
            expect(this.vice.bowed).toBe(true);
            expect(this.challenger.bowed).toBe(true);
            expect(this.yoshi.bowed).toBe(false);
        });

        it('should not prevent bow effects if you were not alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi, this.challenger],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.yoshi);
            this.player1.clickCard(this.vice);
            expect(this.player2).toBeAbleToSelect(this.yoshi);
            this.player2.clickCard(this.yoshi);
            expect(this.yoshi.bowed).toBe(true);
        });

        it('should not prevent bow effects if you were alone', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.vice],
                defenders: [this.yoshi],
                type: 'military'
            });

            this.player2.clickCard(this.stance);
            this.player2.clickCard(this.yoshi);
            expect(this.getChatLogs(5)).toContain('player2 plays Kakita\'s Really Really Final Stance to stop Kakita Yoshi from bowing during conflict resolution and prevent opponents\' actions from bowing it');
            this.player1.clickCard(this.vice);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.noMoreActions();
            expect(this.vice.bowed).toBe(true);
            expect(this.yoshi.bowed).toBe(false);
        });
    });
});
