describe('Time For War 2', function () {
    integration(function () {
        describe('Time For War 2\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['steward-of-law']
                    },
                    player2: {
                        inPlay: ['matsu-berserker', 'doji-whisperer'],
                        hand: ['kamayari', 'time-for-war-evolved', 'cloud-the-mind']
                    }
                });
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['steward-of-law'],
                    defenders: []
                });
            });

            it('should trigger after losing a conflict', function () {
                this.noMoreActions();
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect('time-for-war-evolved');
                this.player2.clickCard('time-for-war-evolved');
                expect(this.player2).toHavePrompt('Choose a character');
                expect(this.player2).toBeAbleToSelect('matsu-berserker');
                expect(this.player2).not.toBeAbleToSelect('doji-whisperer');
                this.matsuBerserker = this.player2.clickCard('matsu-berserker');
                expect(this.player2).toHavePrompt('Choose an attachment');
                expect(this.player2).toBeAbleToSelect('kamayari');
                expect(this.player2).toBeAbleToSelect('cloud-the-mind');
                this.kamayari = this.player2.clickCard('kamayari');
                expect(this.matsuBerserker.attachments).toContain(this.kamayari);
            });
        });
    });
});
