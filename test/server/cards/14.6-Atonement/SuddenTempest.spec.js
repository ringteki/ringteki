describe('Sudden Tempest', function() {
    integration(function() {
        describe('playing Sudden Tempest', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['sudden-tempest']
                    },
                    player2: {
                    }
                });

                this.suddenTempest = this.player1.placeCardInProvince('sudden-tempest', 'province 2');
            });

            it('should be able to select any unclaimed ring', function() {
                this.game.rings.void.claimRing(this.player1.player);
                this.player1.clickCard(this.suddenTempest);

                expect(this.player1).toBeAbleToSelectRing('fire');
                expect(this.player1).not.toBeAbleToSelectRing('void');
                expect(this.player1).toBeAbleToSelectRing('water');
                expect(this.player1).toBeAbleToSelectRing('air');
                expect(this.player1).toBeAbleToSelectRing('earth');
            });

            it('should remove the ring from the game', function() {
                this.player1.clickCard(this.suddenTempest);
                this.player1.clickRing('void');

                expect(this.game.rings.void.removedFromGame).toBe(true);
            });
        });
        describe('effects that interact with a ring but don\'t care about state - Master of Gisei Toshi', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['master-of-gisei-toshi'],
                        dynastyDiscard: ['sudden-tempest']
                    },
                    player2: {
                    }
                });

                this.giseiToshi = this.player1.findCardByName('master-of-gisei-toshi');
                this.suddenTempest = this.player1.placeCardInProvince('sudden-tempest', 'province 2');

                this.player1.clickCard(this.suddenTempest);
                this.player1.clickRing('void');

                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
            });

            it('should allow you to target rings when it doesn\'t specify the state of the ring - Master of Gisei Toshi', function() {
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.giseiToshi);

                this.player1.clickCard(this.giseiToshi);
                expect(this.player1).toBeAbleToSelectRing('void');
                this.player1.clickRing('void');
                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('effects that interact with a removed ring - others', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        inPlay: ['master-alchemist'],
                        dynastyDiscard: ['sudden-tempest'],
                        hand: ['way-of-the-phoenix']
                    },
                    player2: {
                        provinces: ['fuchi-mura', 'shameful-display']
                    }
                });

                this.masterAlchemist = this.player1.findCardByName('master-alchemist');
                this.wayOfThePhoenix = this.player1.findCardByName('way-of-the-phoenix');

                this.suddenTempest = this.player1.placeCardInProvince('sudden-tempest', 'province 2');

                this.fuchiMura = this.player2.findCardByName('fuchi-mura');
                this.shamefulDisplay = this.player2.findCardByName('shameful-display');

                this.player1.clickCard(this.suddenTempest);
                this.player1.clickRing('fire');

                this.noMoreActions();
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
                this.noMoreActions();
            });

            it('should not place fate on Sudden Tempest ring with Fuchi Mura - mentions unclaimed', function() {
                this.noMoreActions();

                const fireRingFate = this.game.rings.fire.fate;

                this.initiateConflict({
                    province: this.fuchiMura,
                    attackers: [this.masterAlchemist],
                    defenders: [],
                    type: 'military'
                });

                expect(this.player2).toBeAbleToSelect(this.fuchiMura);
                this.player2.clickCard(this.fuchiMura);

                expect(this.game.rings.fire.fate).toBe(fireRingFate);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should allow Master Alchemist to put fate on Sudden Tempest ring - doesn\'t mention state', function() {
                this.noMoreActions();

                const fireRingFate = this.game.rings.fire.fate;

                this.initiateConflict({
                    province: this.shamefulDisplay,
                    attackers: [this.masterAlchemist],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();

                this.player1.clickCard(this.masterAlchemist);
                expect(this.player1).toBeAbleToSelect(this.masterAlchemist);
                this.player1.clickCard(this.masterAlchemist);
                this.player1.clickPrompt('Honor this character');

                expect(this.masterAlchemist.isHonored).toBe(true);
                expect(this.game.rings.fire.fate).toBe(fireRingFate + 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
