describe('Superior Papermill', () => {
    describe('Refill option', function () {
        integration(function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'fate',
                    player1: {
                        inPlay: [],
                        dynastyDeck: [],
                        dynastyDiscard: [
                            'superior-papermill',
                            'doji-challenger',
                            'prodigy-of-the-waves',
                            'favorable-ground',
                            'hida-kisada'
                        ]
                    },
                    player2: {
                        inPlay: []
                    }
                });

                this.papermill = this.player1.findCardByName('superior-papermill');
                this.favorable = this.player1.findCardByName('favorable-ground');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.prodigy = this.player1.findCardByName('prodigy-of-the-waves');
                this.kisada = this.player1.findCardByName('hida-kisada');

                this.shameful = this.player1.findCardByName('shameful-display', 'province 1');
                this.shameful.facedown = true;
                this.player1.placeCardInProvince(this.papermill, 'province 1');
                this.papermill.facedown = true;
            });

            it('when revealed in dynasty, should not trigger', function () {
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.challenger, 'dynasty deck');
                this.player1.moveCard(this.prodigy, 'dynasty deck');
                this.player1.moveCard(this.favorable, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');

                this.player1.pass();
                this.player2.pass();

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');

                expect(this.papermill.location).toBe('province 1');
                expect(this.papermill.facedown).toBe(false);

                expect(this.player2).toHavePrompt('Play cards from provinces');
            });

            it('if already revealed, should trigger', function () {
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.challenger, 'dynasty deck');
                this.player1.moveCard(this.prodigy, 'dynasty deck');
                this.player1.moveCard(this.favorable, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');

                this.papermill.facedown = false;
                this.player1.pass();
                this.player2.pass();

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.papermill);
                this.player1.clickCard(this.papermill);

                expect(this.papermill.location).toBe('province 1');
                expect(this.papermill.facedown).toBe(false);
                expect(this.kisada.location).toBe('province 1');
                expect(this.kisada.facedown).toBe(false);
                expect(this.getChatLogs(10)).toContain(
                    'player1 uses Superior Papermill to place Hida Kisada faceup in province 1'
                );
            });

            it('message test - revealed province', function () {
                this.shameful.facedown = false;
                this.player1.reduceDeckToNumber('dynasty deck', 0);
                this.player1.moveCard(this.prodigy, 'dynasty deck');
                this.player1.moveCard(this.favorable, 'dynasty deck');
                this.player1.moveCard(this.kisada, 'dynasty deck');
                this.player1.moveCard(this.challenger, 'dynasty deck');

                this.papermill.facedown = false;
                this.player1.pass();
                this.player2.pass();

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                this.player1.clickCard(this.papermill);

                expect(this.papermill.location).toBe('province 1');
                expect(this.papermill.facedown).toBe(false);
                expect(this.challenger.location).toBe('province 1');
                expect(this.challenger.facedown).toBe(false);
                expect(this.getChatLogs(10)).toContain(
                    'player1 uses Superior Papermill to place Doji Challenger faceup in Shameful Display'
                );
            });

            it('should work if your deck is empty', function () {
                this.player1.reduceDeckToNumber('dynasty deck', 0);

                this.papermill.facedown = false;
                this.player1.pass();
                this.player2.pass();

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.player2.clickPrompt('End Round');
                this.player1.clickPrompt('End Round');

                //Dynasty phase
                expect(this.game.currentPhase).toBe('dynasty');
                this.player1.clickCard(this.papermill);

                expect(this.papermill.location).toBe('province 1');
                expect(this.papermill.facedown).toBe(false);
                expect(this.player1.player.getDynastyCardsInProvince('province 1').length).toBe(2);
                expect(this.getChatLogs(10)).toContain(
                    'player1 uses Superior Papermill to place a card faceup in province 1'
                );
                expect(this.getChatLogs(10)).toContain(
                    "player1's dynasty deck has run out of cards, so they lose 5 honor"
                );
                expect(this.getChatLogs(10)).toContain('player1 is shuffling their dynasty deck');
            });
        });
    });

    describe('Courtesy option', function () {
        integration(function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['brash-samurai', 'doji-challenger', 'kakita-yoshi', 'kakita-toshimoko'],
                        dynastyDeck: [],
                        dynastyDiscard: ['superior-papermill']
                    },
                    player2: {
                        inPlay: ['doji-whisperer']
                    }
                });

                this.papermill = this.player1.findCardByName('superior-papermill');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.yoshi = this.player1.findCardByName('kakita-yoshi');
                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');

                this.whisperer = this.player2.findCardByName('doji-whisperer');

                this.shameful = this.player1.findCardByName('shameful-display', 'province 1');
                this.shameful.facedown = false;
                this.player1.placeCardInProvince(this.papermill, 'province 1');
                this.papermill.facedown = false;

                this.brash.honor();
                this.challenger.honor();
                this.yoshi.honor();
                this.whisperer.honor();
            });

            it('should react to fate phase beginning and give Courtesy to up to two characters', function () {
                let fate = this.player1.fate;
                this.nextPhase(); // fate phase
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.papermill);
                this.player1.clickCard(this.papermill);

                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).toBeAbleToSelect(this.challenger);
                expect(this.player1).toBeAbleToSelect(this.yoshi);
                expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.whisperer);

                this.player1.clickCard(this.brash);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.challenger);
                this.player1.clickCard(this.yoshi);
                this.player1.clickPrompt('Done');

                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Superior Papermill to give Brash Samurai and Doji Challenger courtesy'
                );

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.player1.fate).toBe(fate + 2);
            });
        });
    });
});
