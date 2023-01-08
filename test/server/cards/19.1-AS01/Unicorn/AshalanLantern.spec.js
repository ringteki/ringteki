describe('Ashalan Lantern', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 2,
                    inPlay: ['solemn-scholar', 'student-of-esoterica', 'shiba-tsukune', 'isawa-tadaka'],
                    hand: ['ashalan-lantern', 'elegance-and-grace', 'the-mirror-s-gaze']
                },
                player2: {
                    inPlay: ['doji-challenger']
                }
            });
            this.student = this.player1.findCardByName('student-of-esoterica');
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.tsukune = this.player1.findCardByName('shiba-tsukune');
            this.tadaka = this.player1.findCardByName('isawa-tadaka');

            this.lantern = this.player1.findCardByName('ashalan-lantern');
            this.elegance = this.player1.findCardByName('elegance-and-grace');
            this.gaze = this.player1.findCardByName('the-mirror-s-gaze');

        });

        it('should get some fate when played', function() {
            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.student);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.lantern);
            this.player1.clickCard(this.lantern);
            expect(this.lantern.getFate()).toBe(3);
        });

        it('should allow the player to choose whether to take fate from the attachment or their fate pool', function() {
            this.tsukune.bow();
            this.tsukune.honor();

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.student);
            this.player1.clickCard(this.lantern);

            this.player2.pass();

            let p1Fate = this.player1.fate;
            let lanternFate = this.lantern.getFate();

            this.player1.clickCard(this.elegance);
            this.player1.clickCard(this.tsukune);
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Choose a card to help pay the fate cost of Elegance and Grace');
            expect(this.player1).toBeAbleToSelect(this.lantern);
            this.player1.clickCard(this.lantern);
            expect(this.player1).toHavePrompt('Choose amount of fate to spend from Ashalan Lantern');
            expect(this.player1.currentButtons.length).toBe(4);
            expect(this.player1.currentButtons).toContain('0');
            expect(this.player1.currentButtons).toContain('1');
            expect(this.player1.currentButtons).toContain('2');
            expect(this.player1.currentButtons).toContain('Cancel');

            expect(this.tsukune.bowed).toBe(true);
            this.player1.clickPrompt('2');

            expect(this.player1.fate).toBe(p1Fate);
            expect(this.lantern.getFate()).toBe(lanternFate - 2);
            expect(this.tsukune.bowed).toBe(false);

            expect(this.getChatLogs(10)).toContain('player1 uses Ashalan Lantern to place 3 fate on Ashalan Lantern');
            expect(this.getChatLogs(10)).toContain('player1 takes 2 fate from Ashalan Lantern to pay the cost of Elegance and Grace');
        });

        it('should not pay for attachments', function() {
            this.tsukune.bow();
            this.tsukune.honor();

            this.player1.clickCard(this.lantern);
            this.player1.clickCard(this.student);
            this.player1.clickCard(this.lantern);

            this.player2.pass();

            let p1Fate = this.player1.fate;
            let lanternFate = this.lantern.getFate();

            this.player1.clickCard(this.gaze);
            this.player1.clickCard(this.tadaka);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.player1.fate).toBe(p1Fate - 2);
            expect(this.lantern.getFate()).toBe(lanternFate);
        });
    });
});
