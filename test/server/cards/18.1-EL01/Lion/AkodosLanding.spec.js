describe('Akodos Landing', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi', 'iron-crane-legion', 'doji-challenger'],
                    hand: ['way-of-the-crane', 'warm-welcome', 'fine-katana', 'a-new-name'],
                    stronghold: ['akodo-s-landing']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['let-go']
                }
            });

            this.landing = this.player1.findCardByName('akodo-s-landing');
            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.legion = this.player1.findCardByName('iron-crane-legion');
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');

            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.welcome = this.player1.findCardByName('warm-welcome');
            this.katana = this.player1.findCardByName('fine-katana');
            this.ann = this.player1.findCardByName('a-new-name');

            this.letGo = this.player2.findCardByName('let-go');

            this.player1.player.showBid = 1;
            this.player2.player.showBid = 5;

            this.player1.playAttachment(this.ann, this.yoshi);
            this.player2.pass();
        });

        it('should prompt you to select a character who can attach the card and has no attachments', function() {
            this.player1.clickCard(this.landing);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.yoshi);
            expect(this.player1).not.toBeAbleToSelect(this.legion);
            expect(this.player1).toBeAbleToSelect(this.challenger);
            expect(this.player1).not.toBeAbleToSelect(this.dojiWhisperer);
        });

        it('should put the top card of your deck into a +1/+1 attachment', function() {
            this.player1.moveCard(this.katana, 'conflict deck');

            this.player1.clickCard(this.landing);
            this.player1.clickCard(this.challenger);

            expect(this.katana.location).toBe('removed from game');
            expect(this.challenger.attachments.size()).toBe(1);
            expect(this.challenger.getMilitarySkill()).toBe(4);
            expect(this.challenger.getPoliticalSkill()).toBe(4);
            expect(this.getChatLogs(5)).toContain('player1 uses Akodo\'s Landing, bowing Akodo\'s Landing to attach the top card of their conflict deck to Doji Challenger as a +1/+1 attachment');
        });

        it('if let go should turn back into the original card', function() {
            this.player1.moveCard(this.crane, 'conflict deck');
            this.player1.clickCard(this.landing);
            this.player1.clickCard(this.challenger);

            const attachment = this.challenger.attachments.first();

            expect(this.crane.location).toBe('removed from game');
            this.player2.clickCard(this.letGo);
            expect(this.player2).toBeAbleToSelect(attachment);
            this.player2.clickCard(attachment);
            expect(this.getChatLogs(5)).toContain('player2 plays Let Go to discard Soldier');
            expect(this.crane.location).toBe('conflict discard pile');

            expect(this.challenger.isHonored).toBe(false);
            this.player1.clickCard(this.welcome);
            this.player1.clickCard(this.crane);
            this.player1.clickCard(this.challenger);
            expect(this.challenger.isHonored).toBe(true);
        });
    });
});
