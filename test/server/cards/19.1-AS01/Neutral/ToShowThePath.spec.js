describe('To Show the Path', function () {
    integration(function () {
        describe('it when you do not control a monk or shugenja', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ikoma-prodigy'],
                        hand: ['to-show-the-path']
                    }
                });

                this.prodigy = this.player1.findCardByName('ikoma-prodigy');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
            });

            it('should not trigger', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('when there is no non-monk or non-shugenja to target', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja'],
                        hand: ['to-show-the-path']
                    }
                });

                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
            });

            it('it should not trigger', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('when you control a monk or shugenja and there is a valid target', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['doomed-shugenja', 'togashi-mitsu', 'ikoma-prodigy'],
                        hand: ['to-show-the-path', 'a-perfect-cut']
                    },
                    player2: {
                        inPlay: ['togashi-ichi', 'isawa-kaede', 'moto-youth'],
                        hand: ['a-perfect-cut']
                    }
                });

                this.doomedShugenja = this.player1.findCardByName('doomed-shugenja');
                this.togashiMitsu = this.player1.findCardByName('togashi-mitsu');
                this.prodigy = this.player1.findCardByName('ikoma-prodigy');

                this.togashiIchi = this.player2.findCardByName('togashi-ichi');
                this.isawaKaede = this.player2.findCardByName('isawa-kaede');
                this.motoYouth = this.player2.findCardByName('moto-youth');

                this.toShowThePath = this.player1.findCardByName('to-show-the-path');
                this.aPerfectCut1 = this.player1.findCardByName('a-perfect-cut');

                this.aPerfectCut2 = this.player2.findCardByName('a-perfect-cut');
            });

            it('it should allow to target a non-monk, non-shugenja owned by either player', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Choose a character');

                expect(this.player1).toBeAbleToSelect(this.prodigy);
                expect(this.player1).toBeAbleToSelect(this.motoYouth);
                expect(this.player1).not.toBeAbleToSelect(this.togashiIchi);
                expect(this.player1).not.toBeAbleToSelect(this.isawaKaede);
                expect(this.player1).not.toBeAbleToSelect(this.togashiMitsu);
                expect(this.player1).not.toBeAbleToSelect(this.doomedShugenja);

                this.player1.clickCard(this.prodigy);
                expect(this.getChatLogs(3)).toContain('player1 plays To Show the Path to make targeting Ikoma Prodigy with any card ability by opponents cost 1 more fate');
            });

            it('it should allow to target a non-monk, non-shugenja owned by either player', function () {
                this.player1.clickCard(this.toShowThePath);
                expect(this.player1).toHavePrompt('Choose a character');

                this.player1.clickCard(this.motoYouth);

                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.prodigy],
                    defenders: [this.motoYouth],
                    type: 'military'
                });

                const player1InitialFate = this.player1.fate;
                const player2InitialFate = this.player2.fate;

                this.player2.clickCard(this.aPerfectCut2);
                this.player2.clickCard(this.motoYouth);

                this.player1.clickCard(this.aPerfectCut1);
                this.player1.clickCard(this.motoYouth);

                expect(this.player1.fate).toBe(player1InitialFate); // no cost increase for the player of To Show the Path
                expect(this.player2.fate).toBe(player2InitialFate - 1); // cost increase for the opponent
            });
        });
    });
});
