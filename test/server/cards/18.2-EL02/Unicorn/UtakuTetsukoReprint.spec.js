describe('Tetsuko Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-tadaka-2', 'doji-whisperer', 'shiba-yojimbo'],
                    hand: ['voice-of-honor', 'finger-of-jade', 'yogo-kikuyo'],
                    conflictDiscard: ['defend-your-honor']
                },
                player2: {
                    inPlay: ['definitely-not-tetsuko', 'bayushi-shoju', 'kitsu-spiritcaller'],
                    hand: ['against-the-waves', 'way-of-the-scorpion', 'jade-tetsubo', 'mirumoto-s-fury', 'compelling-testimony'],
                    provinces: ['meditations-on-the-tao']
                }
            });
            this.tadaka = this.player1.findCardByName('isawa-tadaka-2');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.yojimbo = this.player1.findCardByName('shiba-yojimbo');

            this.voice = this.player1.findCardByName('voice-of-honor');
            this.dyh = this.player1.findCardByName('defend-your-honor');
            this.finger = this.player1.findCardByName('finger-of-jade');
            this.kikuyo = this.player1.findCardByName('yogo-kikuyo');

            this.tetsuko = this.player2.findCardByName('definitely-not-tetsuko');
            this.shoju = this.player2.findCardByName('bayushi-shoju');
            this.spiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            this.atw = this.player2.findCardByName('against-the-waves');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
            this.wayOfTheScorpion = this.player2.findCardByName('way-of-the-scorpion');
            this.tetsubo = this.player2.findCardByName('jade-tetsubo');
            this.testimony = this.player2.findCardByName('compelling-testimony');

            this.tadaka.fate = 5;
            this.whisperer.fate = 1;
            this.yojimbo.honor();
            this.player1.playAttachment(this.finger, this.whisperer);
            this.player2.playAttachment(this.tetsubo, this.tetsuko);
            this.noMoreActions();

            this.player1.passConflict();
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                defenders: [this.tadaka, this.whisperer, this.yojimbo],
                attackers: [this.tetsuko, this.shoju]
            });
        });

        it('events should cancel as normal', function() {
            this.player1.pass();
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.voice);
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            expect(this.player1).not.toBeAbleToSelect(this.finger);

            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.isDishonored).toBe(false);
        });

        it('effect should stop events from being cancelled and get an additional action', function() {
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            expect(this.getChatLogs(3)).toContain('player2 uses Definitely Not Tetsuko to take an additional action and prevent their next event this conflict from being cancelled');
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.isDishonored).toBe(true);
        });

        it('effect should stop events from being cancelled (FoJ)', function() {
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.whisperer.isDishonored).toBe(true);
        });

        it('effect should allow DYH to be played, but it wont cancel the event', function() {
            this.player1.moveCard(this.dyh, 'hand');
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.dyh);
            this.player1.clickCard(this.dyh);
            this.player1.clickCard(this.tadaka);
            this.player2.clickCard(this.shoju);
            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.isDishonored).toBe(true);
            expect(this.getChatLogs(3)).toContain('The duel has no effect');
        });

        it('character abilities should cancel as normal', function() {
            let pol = this.tadaka.getPoliticalSkill();
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.shoju);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.getPoliticalSkill()).toBe(pol);
        });

        it('character abilities should cancel as normal', function() {
            let pol = this.whisperer.getPoliticalSkill();
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.shoju);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.finger);
            this.player1.clickCard(this.finger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.whisperer.getPoliticalSkill()).toBe(pol);
        });

        it('attachment abilities should cancel as normal', function() {
            let fate = this.tadaka.fate;
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.tetsubo);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
            this.player1.clickCard(this.yojimbo);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.fate).toBe(fate);
        });

        it('attachment abilities should cancel as normal', function() {
            let fate = this.whisperer.fate;
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.tetsubo);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.finger);
            this.player1.clickCard(this.finger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.whisperer.fate).toBe(fate);
        });

        it('your second event played should be cancellable', function() {
            this.player1.pass();
            this.player2.clickCard(this.tetsuko);
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.tadaka.isDishonored).toBe(true);
            this.player1.pass();
            this.player2.clickCard(this.testimony);
            this.player2.clickCard(this.tadaka);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.voice);
            expect(this.player1).toBeAbleToSelect(this.yojimbo);
        });
    });
});
