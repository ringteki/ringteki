describe('Ramshackle Facade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['hida-yakamo', 'togashi-initiate'],
                    hand: ['war-cry', 'fine-katana', 'a-perfect-cut']
                },
                player2: {
                    inPlay: ['vengeful-berserker']
                }
            });

            this.yakamo = this.player1.findCardByName('hida-yakamo');
            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.vengeful = this.player2.findCardByName('vengeful-berserker');

            this.warcry = this.player1.findCardByName('war-cry');
            this.katana = this.player1.findCardByName('fine-katana');
            this.perfectCut = this.player1.findCardByName('a-perfect-cut');

            this.player1.playAttachment(this.katana, this.yakamo);
        });

        it('should double skill ignoring attachments and sac at the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yakamo, this.initiate],
                defenders: [this.vengeful]
            });
            this.player2.pass();
            this.player1.clickCard(this.perfectCut);
            this.player1.clickCard(this.yakamo);
            this.player2.pass();

            let mil = this.yakamo.getMilitarySkill();
            this.player1.clickCard(this.warcry);
            expect(this.player1).toBeAbleToSelect(this.yakamo);
            expect(this.player1).not.toBeAbleToSelect(this.initiate);
            expect(this.player1).not.toBeAbleToSelect(this.vengeful);
            this.player1.clickCard(this.yakamo);
            expect(this.yakamo.getMilitarySkill()).toBe(mil * 2 - 2);
            expect(this.getChatLogs(5)).toContain('player1 plays War Cry to give Hida Yakamo +6military and sacrifice it at the end of the conflict');
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.yakamo.location).toBe('dynasty discard pile');
            expect(this.getChatLogs(5)).toContain('Hida Yakamo is sacrificed due to War Cry\'s delayed effect');
        });
    });
});
