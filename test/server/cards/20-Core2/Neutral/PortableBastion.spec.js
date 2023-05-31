describe('Portable bastion', function () {
    integration(function () {
        describe('Attachment conditions and discounts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'solemn-scholar', 'shiba-peacemaker'],
                        hand: ['portable-bastion']
                    },
                    player2: {}
                });

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.shibaPeacemaker = this.player1.findCardByName('shiba-peacemaker');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.portableBastion = this.player1.findCardByName('portable-bastion');

                this.initialP1Fate = this.player1.fate;
            });

            it('attaches to a shugenja', function () {
                this.player1.clickCard(this.portableBastion);
                expect(this.player1).toBeAbleToSelect(this.adeptOfTheWaves);
                expect(this.player1).toBeAbleToSelect(this.solemnScholar);
                expect(this.player1).not.toBeAbleToSelect(this.shibaPeacemaker);

                this.player1.clickCard(this.adeptOfTheWaves);
                expect(this.player1.fate).toBe(this.initialP1Fate - 1);
            });

            it('is discounted when attaching to an Earth character', function () {
                this.player1.clickCard(this.portableBastion);
                this.player1.clickCard(this.solemnScholar);
                expect(this.player1.fate).toBe(this.initialP1Fate);
            });
        });

        describe('Anti movement ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'solemn-scholar'],
                        hand: ['portable-bastion']
                    },
                    player2: {
                        dynastyDiscard: ['favorable-ground'],
                        inPlay: ['moto-youth'],
                        hand: ['fight-on']
                    }
                });

                this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
                this.solemnScholar = this.player1.findCardByName('solemn-scholar');
                this.portableBastion = this.player1.findCardByName('portable-bastion');

                this.favorableGround = this.player2.placeCardInProvince('favorable-ground', 'province 1');
                this.fightOn = this.player2.findCardByName('fight-on');
                this.motoYouth = this.player2.findCardByName('moto-youth');
                this.motoYouth.bow();

                this.player1.clickCard(this.portableBastion);
                this.player1.clickCard(this.solemnScholar);
                this.noMoreActions();
            });

            it('stops movement when the shugenja is in the conflict', function () {
                this.initiateConflict({
                    attackers: [this.solemnScholar],
                    defenders: [],
                    type: 'military'
                });

                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.motoYouth);
                expect(this.player1).toHavePrompt('Any interrupts?');

                this.player1.clickCard(this.solemnScholar);
                expect(this.motoYouth.inConflict).toBe(false);

                expect(this.getChatLogs(3)).toContain(
                    "player1 uses Solemn Scholar's gained ability from Portable Bastion to deny Moto Youth's movement"
                );
            });

            it('stops movement when the shugenja is at home', function () {
                this.initiateConflict({
                    attackers: [this.adeptOfTheWaves],
                    defenders: [],
                    type: 'military'
                });

                this.player2.clickCard(this.favorableGround);
                this.player2.clickCard(this.motoYouth);
                expect(this.player1).toHavePrompt('Any interrupts?');

                this.player1.clickCard(this.solemnScholar);
                expect(this.motoYouth.inConflict).toBe(false);

                expect(this.getChatLogs(3)).toContain(
                    "player1 uses Solemn Scholar's gained ability from Portable Bastion to deny Moto Youth's movement"
                );
            });

            it('only stops the movement, allows other effects', function () {
                this.initiateConflict({
                    attackers: [this.solemnScholar],
                    defenders: [],
                    type: 'military'
                });

                this.player2.clickCard(this.fightOn);
                this.player2.clickCard(this.motoYouth);
                expect(this.player1).toHavePrompt('Any interrupts?');

                this.player1.clickCard(this.solemnScholar);
                expect(this.motoYouth.inConflict).toBe(false);
                expect(this.motoYouth.bowed).toBe(false);

                expect(this.getChatLogs(3)).toContain(
                    "player1 uses Solemn Scholar's gained ability from Portable Bastion to deny Moto Youth's movement"
                );
            });
        });
    });
});
