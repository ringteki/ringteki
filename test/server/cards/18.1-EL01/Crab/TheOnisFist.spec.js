describe('The Oni\'s Fist', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['daidoji-nerishma'],
                    dynastyDiscard: ['the-oni-s-fist', 'recalled-defenses']
                },
                player2: {
                    inPlay: []
                }
            });

            this.nerishma = this.player1.findCardByName('daidoji-nerishma');
            this.fist = this.player1.findCardByName('the-oni-s-fist');
            this.defenses = this.player1.findCardByName('recalled-defenses');
            this.player1.placeCardInProvince(this.fist, 'province 1');
            this.fist.facedown = false;
            this.player1.placeCardInProvince(this.defenses, 'province 2');
            this.defenses.facedown = false;

            this.sd = this.player1.findCardByName('shameful-display', 'province 1');
            this.sh = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player2.findCardByName('shameful-display', 'province 2');
            this.sd3 = this.player2.findCardByName('shameful-display', 'province 3');
            this.sd4 = this.player2.findCardByName('shameful-display', 'province 4');
            this.sdSH = this.player2.findCardByName('shameful-display', 'stronghold province');

            this.sd.facedown = false;
            this.sd1.facedown = false;
            this.sd2.facedown = true;
            this.sd3.facedown = false;
            this.sd4.facedown = false;
            this.sdSH.facedown = false;
            this.sd3.isBroken = true;
        });

        it('should discard if you put it in your stronghold', function() {
            this.player1.clickCard(this.defenses);
            this.player1.clickCard(this.fist);
            expect(this.getChatLogs(5)).toContain('The Oni\'s Fist is discarded from play as it is in a Stronghold Province');
            expect(this.fist.location).toBe('dynasty discard pile');
        });

        it('should give itself an honor token at the start of the conflict phase', function() {
            expect(this.fist.getTokenCount('honor')).toBe(0);
            this.advancePhases('conflict');
            expect(this.fist.getTokenCount('honor')).toBe(1);
            expect(this.getChatLogs(5)).toContain('player1 uses The Oni\'s Fist to add a honor token to The Oni\'s Fist');
        });

        it('should give itself an honor token at the start of the conflict phase even on a broken province', function() {
            this.sd.isBroken = true;
            expect(this.fist.getTokenCount('honor')).toBe(0);
            this.advancePhases('conflict');
            expect(this.fist.getTokenCount('honor')).toBe(1);
        });

        it('should trigger at the end of the conflict phase and ask your opponent to break a province', function() {
            this.nerishma.bowed = true;
            this.advancePhases('conflict');
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.fist);
            this.player1.clickCard(this.fist);
            expect(this.player2).toHavePrompt('Choose a province');
            expect(this.player2).toBeAbleToSelect(this.sd1);
            expect(this.player2).not.toBeAbleToSelect(this.sd2);
            expect(this.player2).not.toBeAbleToSelect(this.sd3);
            expect(this.player2).toBeAbleToSelect(this.sd4);
            expect(this.player2).not.toBeAbleToSelect(this.sdSH);
            expect(this.player2).not.toBeAbleToSelect(this.sd);

            this.player2.clickCard(this.sd1);
            expect(this.sd1.isBroken).toBe(true);
            expect(this.fist.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('player1 uses The Oni\'s Fist, removing The Oni\'s Fist from the game to break Shameful Display');
        });

        it('should not trigger at the end of the conflict phase on a broken province', function() {
            this.nerishma.bowed = true;
            this.advancePhases('conflict');
            this.sd.isBroken = true;
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('fate');
        });

        it('should not trigger at the end of the conflict phase without an honor token', function() {
            this.fist.facedown = true;
            this.nerishma.bowed = true;
            this.advancePhases('conflict');
            this.player1.clickCard(this.nerishma);
            this.player1.clickCard(this.fist);
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            this.noMoreActions();
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.game.currentPhase).toBe('fate');
        });
    });
});
