describe('Scouts Steed', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-toshimoko'],
                    dynastyDiscard: ['doji-whisperer'],
                    hand: ['scout-s-steed']
                },
                player2: {
                    inPlay: ['wandering-ronin'],
                    hand: ['talisman-of-the-sun']
                }
            });

            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.steed = this.player1.findCardByName('scout-s-steed');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');

            this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
            this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun');

            this.player1.playAttachment(this.steed, this.toshimoko);

            this.shamefulDisplay1 = this.player2.provinces['province 1'].provinceCard;
            this.shamefulDisplay2 = this.player2.provinces['province 2'].provinceCard;
        });

        it('should not give cavalry and trigger after attacking', function() {
            this.noMoreActions();
            expect(this.toshimoko.hasTrait('cavalry')).toBe(false);
            this.initiateConflict({
                attackers: [this.toshimoko]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.steed);
        });

        it('should let you play a character into the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko]
            });
            this.player1.clickCard(this.steed);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');

            this.player1.clickPrompt('2');
            expect(this.whisperer.location).toBe('play area');
            expect(this.whisperer.isParticipating()).toBe(true);
            expect(this.whisperer.fate).toBe(2);
            expect(this.getChatLogs(10)).toContain('player1 uses Scout\'s Steed to play Doji Whisperer into the conflict');
            expect(this.getChatLogs(10)).toContain('player1 plays Doji Whisperer into the conflict with 2 additional fate');
        });

        it('if you cancel should not let you play the character', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toshimoko]
            });
            this.player1.clickCard(this.steed);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).toBeAbleToSelect(this.whisperer);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Cancel');
            expect(this.whisperer.location).toBe('province 1');
            expect(this.getChatLogs(10)).toContain('player1 uses Scout\'s Steed to play Doji Whisperer into the conflict');
            this.player2.clickPrompt('Done');

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
