describe('Ashalan Lantern', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 10,
                    inPlay: ['solemn-scholar', 'shiba-tsukune', 'isawa-tadaka'],
                    hand: ['ashalan-lantern', 'elegance-and-grace', 'the-mirror-s-gaze', 'a-fate-worse-than-death', 'bayushi-kachiko', 'appeal-to-sympathy']
                },
                player2: {
                    inPlay: ['doji-challenger', 'asahina-artisan'],
                    hand: ['way-of-the-crane']
                }
            });
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');

            this.artisan = this.player2.findCardByName('asahina-artisan');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.lantern = this.player1.findCardByName('ashalan-lantern');
            this.elegance = this.player1.findCardByName('elegance-and-grace');
            this.gaze = this.player1.findCardByName('the-mirror-s-gaze');
            this.afwtd = this.player1.findCardByName('a-fate-worse-than-death');
            this.kachiko = this.player1.findCardByName('bayushi-kachiko');
            this.appeal = this.player1.findCardByName('appeal-to-sympathy');
            this.way = this.player2.findCardByName('way-of-the-crane');

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.player1.moveCard(this.elegance, 'conflict deck');
            this.player1.moveCard(this.gaze, 'conflict deck');
            this.player1.moveCard(this.afwtd, 'conflict deck');
        });

        it('should only attach to shugenja you control', function() {
            this.player1.clickCard(this.lantern);
            expect(this.player1).toBeAbleToSelect(this.scholar);
            expect(this.player1).toBeAbleToSelect(this.tadaka);
            expect(this.player1).not.toBeAbleToSelect(this.tsukune);
            expect(this.player1).not.toBeAbleToSelect(this.tsukune);
        });

        it('should let you choose a card that is legal to play and reduce the cost', function() {
            this.tsukune.bow();
            this.tsukune.honor();

            this.player1.playAttachment(this.lantern, this.scholar);
            this.player2.pass();

            let p1Fate = this.player1.fate;

            this.player1.clickCard(this.lantern);
            expect(this.player1).toHaveDisabledPromptButton('A Fate Worse Than Death');
            expect(this.player1).toHavePromptButton('The Mirror\'s Gaze');
            expect(this.player1).toHavePromptButton('Elegance and Grace');

            this.player1.clickPrompt('Elegance and Grace');
            this.player1.clickCard(this.tsukune);
            this.player1.clickPrompt('Done');

            expect(this.player1.fate).toBe(p1Fate);
            expect(this.tsukune.bowed).toBe(false);
            expect(this.elegance.location).toBe('conflict discard pile');

            expect(this.getChatLogs(10)).toContain('player1 uses Ashalan Lantern, sacrificing Ashalan Lantern to play a card from their conflict deck');
            expect(this.getChatLogs(10)).toContain('player1 takes Elegance and Grace');
            expect(this.getChatLogs(10)).toContain('player1 plays Elegance and Grace from their conflict deck');
            expect(this.getChatLogs(10)).toContain('player1 plays Elegance and Grace to ready Shiba Tsukune');
            expect(this.getChatLogs(10)).toContain('player1 is shuffling their conflict deck');
        });

        it('should work on attachments', function() {
            this.tsukune.bow();
            this.tsukune.honor();

            this.player1.playAttachment(this.lantern, this.scholar);
            this.player2.pass();

            let p1Fate = this.player1.fate;

            this.player1.clickCard(this.lantern);
            expect(this.player1).toHaveDisabledPromptButton('A Fate Worse Than Death');
            expect(this.player1).toHavePromptButton('The Mirror\'s Gaze');
            expect(this.player1).toHavePromptButton('Elegance and Grace');

            this.player1.clickPrompt('The Mirror\'s Gaze');
            this.player1.clickCard(this.scholar);

            expect(this.player1.fate).toBe(p1Fate);
            expect(this.gaze.location).toBe('play area');
            expect(this.scholar.attachments).toContain(this.gaze);

            expect(this.getChatLogs(10)).toContain('player1 takes The Mirror\'s Gaze');
            expect(this.getChatLogs(10)).toContain('player1 plays The Mirror\'s Gaze, attaching it to Solemn Scholar');
        });

        it('should work on characters', function() {
            this.player1.moveCard(this.kachiko, 'conflict deck');
            this.player1.playAttachment(this.lantern, this.scholar);
            this.player2.pass();

            let p1Fate = this.player1.fate;

            this.player1.clickCard(this.lantern);
            expect(this.player1).toHaveDisabledPromptButton('A Fate Worse Than Death');
            expect(this.player1).toHavePromptButton('The Mirror\'s Gaze');
            expect(this.player1).toHavePromptButton('Bayushi Kachiko');

            this.player1.clickPrompt('Bayushi Kachiko');
            this.player1.clickPrompt('1');

            expect(this.player1.fate).toBe(p1Fate - 5 - 1 + 3); // cost, 1 extra fate, 3 discount
            expect(this.kachiko.location).toBe('play area');

            expect(this.getChatLogs(10)).toContain('player1 takes Bayushi Kachiko');
            expect(this.getChatLogs(10)).toContain('player1 plays Bayushi Kachiko at home with 1 additional fate');
        });

        it('should let you play if you can\'t afford the base cost', function() {
            this.player1.moveCard(this.kachiko, 'conflict deck');
            this.player1.playAttachment(this.lantern, this.scholar);
            this.player1.fate = 3;
            this.player2.pass();

            let p1Fate = this.player1.fate;

            this.player1.clickCard(this.lantern);
            expect(this.player1).toHaveDisabledPromptButton('A Fate Worse Than Death');
            expect(this.player1).toHavePromptButton('The Mirror\'s Gaze');
            expect(this.player1).toHavePromptButton('Bayushi Kachiko');

            this.player1.clickPrompt('Bayushi Kachiko');
            this.player1.clickPrompt('0');

            expect(this.player1.fate).toBe(p1Fate - 5 + 3); // cost, 0 extra fate, 3 discount
            expect(this.kachiko.location).toBe('play area');

            expect(this.getChatLogs(10)).toContain('player1 takes Bayushi Kachiko');
            expect(this.getChatLogs(10)).toContain('player1 plays Bayushi Kachiko at home with 0 additional fate');
        });

        it('discount should not carry over if you take nothing', function() {
            this.player1.playAttachment(this.lantern, this.scholar);
            this.player2.pass();

            let p1Fate = this.player1.fate;

            this.player1.clickCard(this.lantern);
            this.player1.clickPrompt('Take nothing');
            expect(this.player1.fate).toBe(p1Fate);

            this.player2.clickCard(this.way);
            this.player2.clickCard(this.challenger);

            this.player1.clickCard(this.appeal);
            expect(this.player1.fate).toBe(p1Fate - 2);
        });
    });
});
