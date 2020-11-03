describe('Daughter of War', function() {
    integration(function() {
        describe('Daughter of War\'s abilities', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        dynastyDiscard: ['eager-scout', 'doji-whisperer', 'brash-samurai', 'doji-challenger', 'honored-general', 'hida-kisada'],
                        inPlay: ['doji-hotaru', 'hida-guardian'],
                        dynastyDeckSize: 4,
                        hand: ['daughter-of-war']
                    },
                    player2: {
                        inPlay: ['vanguard-warrior'],
                        hand: ['noble-sacrifice', 'assassination', 'way-of-the-scorpion']
                    }
                });
                this.eagerScout = this.player1.findCardByName('eager-scout');
                this.hidaGuardian = this.player1.findCardByName('hida-guardian');
                this.dojiWhisperer = this.player1.findCardByName('doji-whisperer');
                this.brashSamurai = this.player1.findCardByName('brash-samurai');
                this.dojiChallenger = this.player1.findCardByName('doji-challenger');
                this.honoredGeneral = this.player1.findCardByName('honored-general');
                this.dojiHotaru = this.player1.findCardByName('doji-hotaru');
                this.daughter = this.player1.findCardByName('daughter-of-war');
                this.dojiHotaru.dishonor();

                this.player1.moveCard(this.eagerScout, 'dynasty deck');
                this.player1.moveCard(this.dojiWhisperer, 'dynasty deck');
                this.player1.moveCard(this.brashSamurai, 'dynasty deck');
                this.player1.moveCard(this.dojiChallenger, 'dynasty deck');
                this.player1.moveCard(this.honoredGeneral, 'dynasty deck');

                this.vanguard = this.player2.findCardByName('vanguard-warrior');
                this.assassination = this.player2.findCardByName('assassination');
                this.nobleSac = this.player2.findCardByName('noble-sacrifice');
                this.scorp = this.player2.findCardByName('way-of-the-scorpion');
                this.vanguard.honor();

                this.noMoreActions();
                this.initiateConflict({
                    type: 'political',
                    attackers: [this.dojiHotaru],
                    defenders: [this.vanguard]
                });
            });

            it('should trigger when attached character leaves play ', function() {
                this.player2.pass();
                this.player1.clickCard(this.daughter);
                this.player1.clickCard(this.hidaGuardian);
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.hidaGuardian);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.daughter);
            });

            it('should allow you bring a character into play that costs less than the one leaving ', function() {
                this.player2.pass();
                this.player1.clickCard(this.daughter);
                this.player1.clickCard(this.dojiHotaru);
                this.player2.clickCard(this.nobleSac);
                this.player2.clickCard(this.dojiHotaru);
                this.player2.clickCard(this.vanguard);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.daughter);
                this.player1.clickCard(this.daughter);
                expect(this.player1).toHavePromptButton('Eager Scout');
                expect(this.player1).toHavePromptButton('Doji Whisperer');
                expect(this.player1).toHavePromptButton('Honored General');
                expect(this.player1).toHavePromptButton('Brash Samurai');
                expect(this.player1).toHavePromptButton('Doji Challenger');
            });

            it('should only allow you to bring in a character that is less than the one leaving ', function() {
                this.player2.pass();
                this.player1.clickCard(this.daughter);
                this.player1.clickCard(this.hidaGuardian);
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.hidaGuardian);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.daughter);
                this.player1.clickCard(this.daughter);
                expect(this.player1).toHavePromptButton('Eager Scout');
                expect(this.player1).not.toHavePromptButton('Doji Whisperer');
                expect(this.player1).not.toHavePromptButton('Honored General');
                expect(this.player1).not.toHavePromptButton('Brash Samurai');
                expect(this.player1).not.toHavePromptButton('Doji Challenger');
                this.player1.clickPrompt('Eager Scout');
                expect(this.getChatLogs(5)).toContain('player1 puts Eager Scout into play');
            });
        });
    });
});
