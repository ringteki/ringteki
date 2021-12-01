describe('Kuni Wasteland Reprint', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-challenger','isawa-ujina','kaiu-envoy','iuchi-shahai','miwaku-kabe-guard'],
                    hand: ['duelist-training']
                },
                player2: {
                    inPlay: ['doji-whisperer'],
                    hand: ['assassination'],
                    provinces: ['kuni-island']
                }
            });
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.ujina = this.player1.findCardByName('isawa-ujina');
            this.envoy = this.player1.findCardByName('kaiu-envoy');
            this.shahai = this.player1.findCardByName('iuchi-shahai');
            this.kabeGuard = this.player1.findCardByName('miwaku-kabe-guard');
            this.training = this.player1.findCardByName('duelist-training');

            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.assassination = this.player2.findCardByName('assassination');
            this.wasteland = this.player2.findCardByName('kuni-island');
        });

        it('should react to conflict declaration and blank the character', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                province: this.wasteland
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.wasteland);
            this.player2.clickCard(this.wasteland);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.ujina);
            this.player2.clickCard(this.challenger);
            expect(this.getChatLogs(5)).toContain('player2 uses Kuni Island to blank Doji Challenger until the end of the conflict');
            this.player2.clickPrompt('Done');
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not stop gained abilities', function() {
            this.player1.playAttachment(this.training, this.challenger);

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                province: this.wasteland
            });
            this.player2.clickCard(this.wasteland);
            this.player2.clickCard(this.challenger);
            this.player2.clickCard(this.whisperer);
            this.player2.clickPrompt('Done');
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Doji Challenger');
        });

        // it('should not stop forced abilities', function() {
        //     this.noMoreActions();
        //     this.initiateConflict({
        //         type: 'military',
        //         attackers: [this.ujina],
        //         defenders: [],
        //         ring: 'void',
        //         province: this.wasteland
        //     });
        //     this.player2.pass();
        //     this.player1.pass();
        //     expect(this.player1).toHavePrompt('Isawa Ujina');
        //     this.player1.clickCard(this.challenger);
        //     expect(this.challenger.location).toBe('removed from game');
        // });
    });
});
