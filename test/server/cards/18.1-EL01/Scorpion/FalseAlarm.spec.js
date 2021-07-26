describe('False Alarm', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    honor: 10,
                    inPlay: ['doji-kuwanan', 'border-rider']
                },
                player2: {
                    honor: 10,
                    inPlay: ['nightshade-infiltrator', 'kakita-yoshi'],
                    hand: ['false-alarm']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.nightshade = this.player2.findCardByName('nightshade-infiltrator');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.rider = this.player1.findCardByName('border-rider');
            this.alarm = this.player2.findCardByName('false-alarm');
        });

        it('should prompt you to choose a participating shinobi', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade, this.yoshi]
            });
            this.player2.clickCard(this.alarm);
            expect(this.player2).not.toBeAbleToSelect(this.kuwanan);
            expect(this.player2).toBeAbleToSelect(this.nightshade);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.rider);
        });

        it('should prompt you to optionally choose an opponents character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade, this.yoshi]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.nightshade);
            expect(this.player2).not.toBeAbleToSelect(this.yoshi);
            expect(this.player2).not.toBeAbleToSelect(this.rider);
            expect(this.player2).toHavePromptButton('Done');
        });

        it('if you pick an opponent\'s character should not dishonor if you still have a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade, this.yoshi]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            this.player2.clickCard(this.kuwanan);
            expect(this.nightshade.isParticipating()).toBe(false);
            expect(this.kuwanan.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 plays False Alarm to send Nightshade Infiltrator home');
        });

        it('if you don\'t pick an opponent\'s character should still send you home', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade, this.yoshi]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            this.player2.clickPrompt('Done');
            expect(this.nightshade.isParticipating()).toBe(false);
            expect(this.kuwanan.isDishonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 plays False Alarm to send Nightshade Infiltrator home');
        });

        it('if you pick an opponent\'s character, dishonor if you don\'t have a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            this.player2.clickCard(this.kuwanan);
            expect(this.nightshade.isParticipating()).toBe(false);
            expect(this.kuwanan.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain('player2 plays False Alarm to send Nightshade Infiltrator home and dishonor Doji Kuwanan');
        });
    });
});
