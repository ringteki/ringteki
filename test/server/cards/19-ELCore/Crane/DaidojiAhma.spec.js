describe('Daidoji Ahma', function() {
    integration(function() {
        describe('Kakita Ryoku\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: ['daidoji-ahma']
                    },
                    player2: {
                        inPlay: [],
                        dynastyDiscard: ['moto-youth', 'moto-youth', 'border-rider', 'imperial-storehouse', 'a-season-of-war']
                    }
                });
                this.ahma = this.player1.findCardByName('daidoji-ahma');
                this.ahma.fate = 1;
                this.youth1 = this.player2.filterCardsByName('moto-youth')[0];
                this.youth2 = this.player2.filterCardsByName('moto-youth')[1];
                this.rider = this.player2.findCardByName('border-rider');
                this.storehouse = this.player2.findCardByName('imperial-storehouse');
                this.season = this.player2.findCardByName('a-season-of-war');

                this.player2.moveCard(this.youth1, 'province 1');
                this.player2.moveCard(this.youth2, 'province 2');
                this.player2.moveCard(this.rider, 'province 2');
                this.player2.moveCard(this.storehouse, 'province 3');
                this.player2.moveCard(this.season, 'province 4');

                this.youth1.facedown = false;
                this.youth2.facedown = false;
                this.rider.facedown = true;
                this.storehouse.facedown = false;
                this.season.facedown = false;
            });

            it('should trigger at the start of any phase', function() {
                this.noMoreActions(); // fate phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                this.noMoreActions(); // dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickPrompt('Pass');

                this.noMoreActions();// draw phase
                expect(this.game.currentPhase).toBe('draw');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // conflict phase
                expect(this.game.currentPhase).toBe('conflict');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickPrompt('Pass');

                this.nextPhase(); // fate phase
                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickPrompt('Pass');
                this.noMoreActions();
                this.player2.clickPrompt('Done');
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('End Round');
                this.player2.clickPrompt('End Round');
            });

            it('should increase the cost of a chosen character', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                // Player 2 is first player now

                this.noMoreActions(); // dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickCard(this.ahma);
                expect(this.player1).toBeAbleToSelect(this.youth1);
                expect(this.player1).toBeAbleToSelect(this.youth2);
                expect(this.player1).not.toBeAbleToSelect(this.rider);
                expect(this.player1).toBeAbleToSelect(this.storehouse);
                expect(this.player1).not.toBeAbleToSelect(this.season);
                this.player1.clickCard(this.youth1);
                let fate = this.player2.fate;
                let cost1 = this.youth1.printedCost;
                let cost2 = this.youth2.printedCost;

                this.player2.clickCard(this.youth2);
                this.player2.clickPrompt('0');
                expect(this.player2.fate).toBe(fate - cost2);

                this.player1.pass();

                this.player2.clickCard(this.youth1);
                this.player2.clickPrompt('0');
                expect(this.player2.fate).toBe(fate - cost2 - (cost1 + 1));
                expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ahma to increase the cost to play Moto Youth by 1 this phase');
            });

            it('should add a triggering cost to a holding', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                // Player 2 is first player now

                this.noMoreActions(); // dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickCard(this.ahma);
                this.player1.clickCard(this.storehouse);
                let fate1 = this.player1.fate;
                let fate2 = this.player2.fate;

                this.player2.clickCard(this.storehouse);
                expect(this.player1.fate).toBe(fate1 + 1);
                expect(this.player2.fate).toBe(fate2 - 1);

                expect(this.getChatLogs(10)).toContain('player1 uses Daidōji Ahma to force player2 to give them 1 fate as an additional cost to trigger Imperial Storehouse this phase');
                expect(this.getChatLogs(10)).toContain('player2 gives player1 1 fate to trigger Imperial Storehouse\'s ability');
            });

            it('should not let you trigger the holding if you have no fate', function() {
                this.noMoreActions();
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                // Player 2 is first player now

                this.noMoreActions(); // dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                expect(this.player1).toBeAbleToSelect(this.ahma);
                this.player1.clickCard(this.ahma);
                this.player1.clickCard(this.storehouse);
                this.player2.fate = 0;
                this.game.checkGameState(true);

                expect(this.player2).toHavePrompt('Play cards from provinces');
                this.player2.clickCard(this.storehouse);
                expect(this.player2).toHavePrompt('Play cards from provinces');
            });
        });
    });
});

