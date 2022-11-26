describe('Ichigo-kun', function () {
    integration(function () {
        describe('Ichigo-kun enter play effect', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['ichigo-kun']
                    }
                });

                this.ichigoKun = this.player1.placeCardInProvince('ichigo-kun', 'province 1');
            });

            it('should place fate according to facedown provinces upon entering play', function () {
                this.player1.clickCard(this.ichigoKun);
                this.player1.clickPrompt('0');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.ichigoKun);

                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.fate).toBe(5); //0 + 5 facedown
            });
        });

        describe('Ichigo-kun cannot be evaded', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['shameful-display']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');


                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
            });

            it('should not be able to be evaded by covert', function () {
                this.noMoreActions();
                this.player1.passConflict();

                this.noMoreActions();
                expect(this.player2).toHavePrompt('initiate conflict');
                this.player2.clickCard(this.ikehata);
                this.player2.clickRing('air');
                this.player2.clickCard(this.shamefulDisplay1);

                expect(this.player2).toHavePromptButton('Initiate Conflict');
                this.player2.clickPrompt('Initiate Conflict');

                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player1.clickCard(this.ichigoKun);
                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(true);
                expect(this.ikehata.isAttacking()).toBe(true);
            });
        });

        describe('Ichigo-kun during fire conflicts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata'],
                        hand: ['elemental-inversion'],
                        provinces: ['shameful-display']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
                this.elementalInversion = this.player2.findCardByName('elemental-inversion');
            });

            it('cannot be declared as an attacker', function () {
                this.noMoreActions();

                expect(this.player1).toHavePrompt('initiate conflict');

                this.player1.clickCard(this.shamefulDisplay1);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isAttacking()).toBe(false);
                expect(this.game.currentConflict.element).toBe('fire');
                expect(this.game.currentConflict.attackers).not.toContain(this.ichigoKun);
            });

            it('cannot be declared as a defender', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                expect(this.player2).toHavePrompt('initiate conflict');

                this.player2.clickCard(this.manicuredGarden);
                this.player2.clickRing('fire');
                this.player2.clickCard(this.ikehata);
                this.player2.clickPrompt('Initiate Conflict');
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.ichigoKun);
            });

            it('cannot participate should the ring become fire', function () {
                this.noMoreActions();

                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: []
                });

                this.player2.clickCard(this.elementalInversion);
                this.player2.clickRing('fire');

                expect(this.getChatLogs(3)).toContain('Ichigo-kun cannot participate in the conflict any more and is sent home bowed');
            });
        });

        describe('Ichigo-kun interaction with discarding cards from hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        provinces: ['manicured-garden'],
                        inPlay: ['ichigo-kun', 'saadiyah-al-mozedu'],
                        hand: ['fine-katana']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.saadiyah = this.player1.findCardByName('saadiyah-al-mozedu');
                this.fineKatana = this.player1.findCardByName('fine-katana');
                this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');

                this.manicuredGarden.facedown = false;
            });

            it('should interrupt when discarding a card from hand and put it under Ichigo-kun, giving him 1 military skill per card', function () {
                this.player1.clickCard(this.saadiyah);
                this.player1.clickCard(this.manicuredGarden);
                this.player1.clickCard(this.fineKatana);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain("player1 uses Ichigo-kun to place Fine Katana underneath Ichigo-kun instead of discarding them");
                expect(this.fineKatana.location).toBe(this.ichigoKun.uuid);
                expect(this.ichigoKun.getMilitarySkill()).toBe(3 + 1); //base + 1 card
                expect(this.ichigoKun.getPoliticalSkill()).toBe(0); //base unmodified
            });
        });
    });
});
