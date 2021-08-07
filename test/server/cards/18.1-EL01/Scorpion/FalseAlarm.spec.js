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
                    hand: ['false-alarm'],
                    conflictDiscard: ['fiery-madness', 'fine-katana']
                }
            });

            this.yoshi = this.player2.findCardByName('kakita-yoshi');
            this.nightshade = this.player2.findCardByName('nightshade-infiltrator');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.rider = this.player1.findCardByName('border-rider');
            this.alarm = this.player2.findCardByName('false-alarm');
            this.madness = this.player2.findCardByName('fiery-madness');
            this.katana = this.player2.findCardByName('fine-katana');
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

        it('should not work if unopposed', function() {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.nightshade, this.yoshi],
                defenders: []
            });
            this.player1.pass();
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.alarm);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should not prompt you to pick a poison if you still have a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade, this.yoshi]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            expect(this.nightshade.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 plays False Alarm to send Nightshade Infiltrator home');
        });

        it('get a poison if you don\'t have a participating character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.kuwanan],
                defenders: [this.nightshade]
            });
            this.player2.clickCard(this.alarm);
            this.player2.clickCard(this.nightshade);
            expect(this.nightshade.isParticipating()).toBe(false);
            expect(this.getChatLogs(5)).toContain('player2 plays False Alarm to send Nightshade Infiltrator home and return a Poison to their hand');
            let hand = this.player2.hand.length;
            expect(this.player2).toHavePrompt('Choose a poison');
            expect(this.player2).toBeAbleToSelect(this.madness);
            expect(this.player2).not.toBeAbleToSelect(this.katana);
            this.player2.clickCard(this.madness);

            expect(this.madness.location).toBe('hand');
            expect(this.player2.hand.length).toBe(hand + 1);
            expect(this.getChatLogs(5)).toContain('player2 returns Fiery Madness to their hand');
        });
    });
});
