describe('Seven Stings Keep', function() {
    integration(function() {
        describe('Seven Stings Keep\'s triggering window', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar'],
                        stronghold: ['seven-stings-keep']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.keep = this.player1.findCardByName('seven-stings-keep');
            });

            it('should give the option to trigger when your conflict opportunity starts', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.keep);
            });

            it('should not give the option to trigger when you can\'t attack', function() {
                this.liar.bowed = true;
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Action Window');
                expect(this.getChatLogs(1)).toContain('player1 passes their conflict opportunity as none of their characters can be declared as an attacker');
            });
        });

        describe('Seven Stings Keep\'s choice menu', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'alibi-artist', 'matsu-berserker', 'young-warrior', 'young-warrior'],
                        stronghold: ['seven-stings-keep']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.artist = this.player1.findCardByName('alibi-artist');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.warrior1 = this.player1.filterCardsByName('young-warrior')[0];
                this.warrior2 = this.player1.filterCardsByName('young-warrior')[1];
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.keep = this.player1.findCardByName('seven-stings-keep');

                this.liar.bowed = true;
                this.artist.bowed = true;
                this.berserker.bowed = true;
                this.warrior1.bowed = true;
                this.warrior2.bowed = true;
            });

            it('checking maximum - mixed dashes', function() {
                this.liar.bowed = false;
                this.artist.bowed = false;
                this.berserker.bowed = false;

                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                expect(this.getChatLogs(1)).toContain('player1 uses Seven Stings Keep, bowing Seven Stings Keep to to force player2 to declare defenders before attackers are chosen this conflict');
                expect(this.player1).toHavePrompt('Choose how many characters will be attacking');
                expect(this.player1).not.toHavePromptButton('0');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).not.toHavePromptButton('3');
            });

            it('checking minimum - forced attackers', function() {
                this.warrior1.bowed = false;
                this.warrior2.bowed = false;
                this.artist.bowed = false;
                this.liar.bowed = false;

                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                expect(this.player1).toHavePrompt('Choose how many characters will be attacking');
                expect(this.player1).not.toHavePromptButton('0');
                expect(this.player1).not.toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).toHavePromptButton('4');
                expect(this.player1).not.toHavePromptButton('5');
            });

            it('checking messaging', function() {
                this.liar.bowed = false;
                this.artist.bowed = false;
                this.berserker.bowed = false;

                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                this.player1.clickPrompt('2');
                expect(this.getChatLogs(1)).toContain('player1 will attack with 2 characters');
            });
        });

        describe('Seven Stings Keep - Conflict Flow', function() {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-liar', 'alibi-artist', 'matsu-berserker'],
                        stronghold: ['seven-stings-keep']
                    },
                    player2: {
                        inPlay: ['kakita-toshimoko', 'asahina-takako', 'ashigaru-levy']
                    }
                });

                this.liar = this.player1.findCardByName('bayushi-liar');
                this.artist = this.player1.findCardByName('alibi-artist');
                this.berserker = this.player1.findCardByName('matsu-berserker');
                this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
                this.takako = this.player2.findCardByName('asahina-takako');
                this.levy = this.player2.findCardByName('ashigaru-levy');
                this.keep = this.player1.findCardByName('seven-stings-keep');
            });

            it('should prompt opponent to choose defenders - testing with dashes', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                this.player1.clickPrompt('1');
                expect(this.player2).toHavePrompt('Choose Defenders');
                expect(this.player2).toHavePrompt('Declaring defenders before attackers');
                this.player2.clickCard(this.takako);
                this.player2.clickCard(this.levy);
                this.player2.clickCard(this.toshimoko);
                expect(this.game.currentConflict.defenders).toContain(this.takako);
                expect(this.game.currentConflict.defenders).toContain(this.levy);
                expect(this.game.currentConflict.defenders).toContain(this.toshimoko);
                expect(this.player2).toHavePromptButton('Done');
            });

            it('should then do normal conflict prompt', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                this.player1.clickPrompt('1');
                this.player2.clickCard(this.takako);
                this.player2.clickCard(this.levy);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Initiate Conflict');
            });

            it('should not eject dash defenders just by switching the conflict type', function() {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.keep);
                this.player1.clickPrompt('1');
                this.player2.clickCard(this.takako);
                this.player2.clickCard(this.levy);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Initiate Conflict');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Military Fire Conflict');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Political Fire Conflict');
                this.player1.clickRing('fire');
                expect(this.player1).toHavePrompt('Military Fire Conflict');

                expect(this.game.currentConflict.defenders).toContain(this.takako);
                expect(this.game.currentConflict.defenders).toContain(this.levy);
                expect(this.game.currentConflict.defenders).toContain(this.toshimoko);
            });
        });
    });
});
