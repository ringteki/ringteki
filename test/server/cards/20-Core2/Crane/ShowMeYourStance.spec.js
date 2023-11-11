describe('Show Me Your Stance', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 20,
                    inPlay: ['doji-challenger', 'kakita-yoshi'],
                    hand: ['show-me-your-stance']
                },
                player2: {
                    inPlay: ['kakita-toshimoko', 'shiba-tsukune'],
                    hand: ['embrace-the-void', 'policy-debate']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.stance = this.player1.findCardByName('show-me-your-stance');
            this.toshimoko = this.player2.findCardByName('kakita-toshimoko');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.tsukune = this.player2.findCardByName('shiba-tsukune');
            this.pd = this.player2.findCardByName('policy-debate');
        });

        describe('Duel Strike', function () {
            it('should react on a tie', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stance);
            });

            it('should do a bit of everything', function () {
                let fate = this.player1.fate;
                let honor = this.player1.honor;
                let cards = this.player1.hand.length;

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                this.player1.clickCard(this.stance);

                expect(this.player1.fate).toBe(fate + 1);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.player1.hand.length).toBe(cards); // -1 from playing card, +1 from drawing
                expect(this.challenger.isHonored).toBe(true);

                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Show Me Your Stance to draw a card, gain a fate, gain an honor, and honor one of their duelists'
                );
                expect(this.getChatLogs(5)).toContain('player1 honors Doji Challenger');
            });

            it('should not react if you win', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('2');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Policy Debate');
            });

            it('should not react if you lose', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko]
                });

                this.player2.clickCard(this.pd);
                this.player2.clickCard(this.toshimoko);
                this.player2.clickCard(this.challenger);

                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');

                expect(this.player2).toHavePrompt('Policy Debate');
            });
        });

        describe('Send Home', function () {
            it('should let you pick someone with glory equal to or less than a participating duelist you control and send them home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.toshimoko, this.tsukune]
                });

                this.player2.pass();

                this.player1.clickCard(this.stance);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.tsukune);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.toshimoko);

                expect(this.toshimoko.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Show Me Your Stance to send Kakita Toshimoko home'
                );
            });

            it('should not work without a participating duelist', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.yoshi],
                    defenders: [this.toshimoko]
                });

                this.player2.pass();

                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.stance);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
