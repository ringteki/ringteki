describe('One With the Sea', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'draw',
                player1: {
                    inPlay: ['doji-challenger', 'doji-kuwanan'],
                    hand: ['one-with-the-sea'],
                    dynastyDiscard: ['secluded-shrine']
                },
                player2: {
                    inPlay: ['kakita-yoshi']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.sea = this.player1.findCardByName('one-with-the-sea');
            this.shrine = this.player1.findCardByName('secluded-shrine');
            this.player1.placeCardInProvince(this.shrine, 'province 1');
            this.shrine.facedown = false;

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            this.noMoreActions();

            this.player1.clickCard(this.shrine);
            this.player1.clickRing('water');
        });

        it('should not prompt you to return a ring you can\'t return', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 plays One with the Sea to move Doji Kuwanan into the conflict');
        });

        it('should prompt you to return the water ring', function() {
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            expect(this.player1).toHavePrompt('Return the water ring?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            this.player1.clickPrompt('Yes');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.yoshi);

            this.player1.clickCard(this.yoshi);
            expect(this.yoshi.isParticipating()).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 chooses to return the water ring');
            expect(this.getChatLogs(5)).toContain('player1 plays One with the Sea to move Kakita Yoshi into the conflict');
        });

        it('if you don\'t return the ring', function() {
            this.player1.claimRing('water');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.sea);
            expect(this.player1).toHavePrompt('Return the water ring?');
            expect(this.player1).toHavePromptButton('Yes');
            expect(this.player1).toHavePromptButton('No');

            this.player1.clickPrompt('No');
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
        });
    });
});
