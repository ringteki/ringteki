describe('Supply Officer', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['supply-officer', 'doji-challenger']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer', 'miya-mystic'],
                    hand: ['grasp-of-earth-2']
                }
            });
            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.mystic = this.player2.findCardByName('miya-mystic');
            this.grasp = this.player2.findCardByName('grasp-of-earth-2');

            this.supply = this.player1.findCardByName('supply-officer');
            this.challenger = this.player1.findCardByName('doji-challenger');
        });

        it('swap locations and ready character at home', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu]
            });

            this.challenger.bow();
            this.player2.pass();

            this.player1.clickCard(this.supply);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.supply);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.challenger);

            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.supply);
            expect(this.player1).not.toBeAbleToSelect(this.mitsu);
            expect(this.player1).not.toBeAbleToSelect(this.whisperer);

            expect(this.supply.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(true);
            expect(this.challenger.bowed).toBe(true);

            this.player1.clickCard(this.supply);

            expect(this.supply.isParticipating()).toBe(true);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.challenger.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Supply Officer to switch Doji Challenger and Supply Officer');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is readied');
        });

        it('cancel movement', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mystic]
            });

            this.challenger.bow();
            this.player2.playAttachment(this.grasp, this.mystic);

            this.player1.clickCard(this.supply);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.supply);

            this.player2.clickCard(this.mystic);

            expect(this.supply.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.challenger.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Supply Officer to switch Doji Challenger and Supply Officer');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is readied');
        });

        it('cancel movement in should still ready', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mystic]
            });

            this.challenger.bow();
            this.player2.playAttachment(this.grasp, this.mystic);

            this.player1.clickCard(this.supply);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.supply);

            this.player2.clickCard(this.mystic);

            expect(this.supply.isParticipating()).toBe(false);
            expect(this.challenger.isParticipating()).toBe(false);
            expect(this.challenger.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player1 uses Supply Officer to switch Doji Challenger and Supply Officer');
            expect(this.getChatLogs(5)).toContain('Doji Challenger is readied');
        });
    });
});
