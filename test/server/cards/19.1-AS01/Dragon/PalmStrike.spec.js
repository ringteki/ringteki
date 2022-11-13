describe('Palm Strike', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'togashi-initiate',
                        'doomed-shugenja',
                        'shrine-maiden'
                    ],
                    hand: ['palm-strike', 'ancestral-daisho'],
                    dynastyDiscard: []
                },
                player2: {
                    inPlay: ['brash-samurai'],
                    hand: ['kakita-blade', 'elegant-tessen']
                }
            });

            this.initiate = this.player1.findCardByName('togashi-initiate');
            this.doomedShugenja =
                this.player1.findCardByName('doomed-shugenja');
            this.shrineMaiden = this.player1.findCardByName('shrine-maiden');
            this.palmStrike = this.player1.findCardByName('palm-strike');
            this.ancestralDaisho =
                this.player1.findCardByName('ancestral-daisho');

            this.brash = this.player2.findCardByName('brash-samurai');
            this.kakitaBlade = this.player2.findCardByName('kakita-blade');
            this.elegantTessen = this.player2.findCardByName('elegant-tessen');
        });

        describe('when the opponent has a weapon', function () {
            beforeEach(function () {
                this.player1.pass();
                this.player2.playAttachment(this.kakitaBlade, this.brash);
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.initiate, this.doomedShugenja],
                    defenders: [this.brash]
                });
            });

            it('should not be playable', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.palmStrike);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('when the monk has a weapon', function () {
            beforeEach(function () {
                this.player1.playAttachment(
                    this.ancestralDaisho,
                    this.initiate
                );
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.initiate, this.doomedShugenja],
                    defenders: [this.brash]
                });
            });

            it('should not be playable', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.palmStrike);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });

        describe('when an non-tattooed monk and the opponent have no weapons', function () {
            beforeEach(function () {
                this.player1.playAttachment(
                    this.ancestralDaisho,
                    this.doomedShugenja
                );
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.shrineMaiden, this.doomedShugenja],
                    defenders: [this.brash],
                    ring: 'void'
                });

                this.player2.pass();
                this.player1.clickCard(this.palmStrike);
                this.player1.clickCard(this.shrineMaiden);
                this.player1.clickCard(this.brash);
            });

            it('should bow the opponent', function () {
                expect(this.brash.bowed).toBe(true);
            });

            it('should prevent the opponent from readying during the conflict', function () {
                this.player2.clickCard(this.elegantTessen);
                this.player2.clickCard(this.brash);
                expect(this.player2).toHavePrompt(
                    'Waiting for opponent to take an action or pass'
                );
                expect(this.brash.bowed).toBe(true);
            });

            it('displays messages', function () {
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Palm Strike to bow an opposing character'
                );
                expect(this.getChatLogs(5)).toContain(
                    'Shrine Maiden strikes down Brash Samurai.'
                );
            });
        });

        describe('when a tattooed monk and the opponent have no weapons', function () {
            beforeEach(function () {
                this.player1.playAttachment(
                    this.ancestralDaisho,
                    this.doomedShugenja
                );
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.initiate, this.doomedShugenja],
                    defenders: [this.brash],
                    ring: 'void'
                });

                this.player2.pass();
                this.player1.clickCard(this.palmStrike);
                this.player1.clickCard(this.initiate);
                this.player1.clickCard(this.brash);
            });

            it('should bow the opponent', function () {
                expect(this.brash.bowed).toBe(true);
            });

            it('should prevent the opponent from readying until the end of the phase', function () {
                this.noMoreActions();
                this.player1.clickPrompt('No');

                this.player1.pass();
                this.player2.clickCard(this.elegantTessen);
                this.player2.clickCard(this.brash);
                expect(this.player2).toHavePrompt(
                    'Waiting for opponent to take an action or pass'
                );
                expect(this.brash.bowed).toBe(true);
            });

            it('displays messages', function () {
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Palm Strike to bow an opposing character'
                );
                expect(this.getChatLogs(5)).toContain(
                    'Togashi Initiate overpowers Brash Samurai with the mystical powers of the Ise Zumi.'
                );
            });
        });
    });
});
