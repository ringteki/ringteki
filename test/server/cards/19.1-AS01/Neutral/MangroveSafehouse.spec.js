describe('Mangrove Safehouse', function () {
    integration(function () {
        describe('Mangrove Safehouse\'s ability', function () {
            describe('Constant ability', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['mangrove-safehouse'],
                            inPlay: ['adept-of-the-waves', 'kudaka']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator', 'yuta']
                        }
                    });

                    this.mangroveSafehouse = this.player1.placeCardInProvince(
                        'mangrove-safehouse',
                        'province 2'
                    );
                    this.p1 = this.player1.findCardByName(
                        'shameful-display',
                        'province 1'
                    );
                    this.p2 = this.player1.findCardByName(
                        'shameful-display',
                        'province 2'
                    );
                    this.p3 = this.player1.findCardByName(
                        'shameful-display',
                        'province 3'
                    );
                    this.p4 = this.player1.findCardByName(
                        'shameful-display',
                        'province 4'
                    );
                });

                describe('while you did not claim the water ring', function () {
                    it('gives strength penalty to adjacent provinces', function () {
                        expect(this.p1.getStrength()).toBe(3 - 1);
                        expect(this.p2.getStrength()).toBe(3 + 1);
                        expect(this.p3.getStrength()).toBe(3 - 1);
                        expect(this.p4.getStrength()).toBe(3);
                    });
                });

                describe('while you did claim the water ring', function () {
                    beforeEach(function () {
                        this.game.rings.water.claimRing(this.player1.player);
                        this.game.checkGameState(true);
                    });

                    it('does not give strength penalty to adjacent provinces', function () {
                        expect(this.p1.getStrength()).toBe(3);
                        expect(this.p2.getStrength()).toBe(3 + 1);
                        expect(this.p3.getStrength()).toBe(3);
                        expect(this.p4.getStrength()).toBe(3);
                    });
                });
            });

            describe('Outside of a conflict', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['mangrove-safehouse'],
                            inPlay: ['adept-of-the-waves', 'kudaka']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator', 'yuta']
                        }
                    });
                    this.mangroveSafehouse = this.player1.placeCardInProvince(
                        'mangrove-safehouse',
                        'province 2'
                    );
                });

                it('should not be triggered outside of a conflict', function () {
                    this.player1.clickCard(this.mangroveSafehouse);
                    expect(this.player1).toHavePrompt('Initiate an action');
                });
            });

            describe('While defending', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['mangrove-safehouse'],
                            inPlay: ['adept-of-the-waves', 'kudaka']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator', 'yuta']
                        }
                    });

                    this.adeptOfTheWaves =
                        this.player1.findCardByName('adept-of-the-waves');
                    this.kudaka = this.player1.findCardByName('kudaka');
                    this.mangroveSafehouse = this.player1.placeCardInProvince(
                        'mangrove-safehouse',
                        'province 2'
                    );

                    this.bayushiManipulator = this.player2.findCardByName(
                        'bayushi-manipulator'
                    );
                    this.yuta = this.player2.findCardByName('yuta');

                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                });

                it('should not trigger on political defenses', function () {
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.bayushiManipulator, this.yuta],
                        defenders: [this.adeptOfTheWaves, this.kudaka]
                    });
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.mangroveSafehouse);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not trigger on military defenses', function () {
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.bayushiManipulator, this.yuta],
                        defenders: [this.adeptOfTheWaves, this.kudaka]
                    });
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.mangroveSafehouse);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });

            describe('While attacking political', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['mangrove-safehouse'],
                            inPlay: ['adept-of-the-waves', 'kudaka']
                        },
                        player2: {
                            inPlay: ['bayushi-manipulator', 'yuta']
                        }
                    });

                    this.adeptOfTheWaves =
                        this.player1.findCardByName('adept-of-the-waves');
                    this.kudaka = this.player1.findCardByName('kudaka');
                    this.mangroveSafehouse = this.player1.placeCardInProvince(
                        'mangrove-safehouse',
                        'province 2'
                    );

                    this.bayushiManipulator = this.player2.findCardByName(
                        'bayushi-manipulator'
                    );
                    this.yuta = this.player2.findCardByName('yuta');

                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'political',
                        attackers: [this.adeptOfTheWaves, this.kudaka],
                        defenders: [this.bayushiManipulator, this.yuta]
                    });
                    this.player2.clickPrompt('Pass');
                });

                it('should not trigger', function () {
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.mangroveSafehouse);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });

            describe('While attacking military', function () {
                beforeEach(function () {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            dynastyDiscard: ['mangrove-safehouse'],
                            inPlay: [
                                'adept-of-the-waves',
                                'kudaka',
                                'solemn-scholar'
                            ]
                        },
                        player2: {
                            inPlay: [
                                'bayushi-manipulator',
                                'yuta',
                                'keeper-initiate'
                            ]
                        }
                    });

                    this.adeptOfTheWaves =
                        this.player1.findCardByName('adept-of-the-waves');
                    this.kudaka = this.player1.findCardByName('kudaka');
                    this.solemnScholar =
                        this.player1.findCardByName('solemn-scholar');
                    this.mangroveSafehouse = this.player1.placeCardInProvince(
                        'mangrove-safehouse',
                        'province 2'
                    );

                    this.bayushiManipulator = this.player2.findCardByName(
                        'bayushi-manipulator'
                    );
                    this.yuta = this.player2.findCardByName('yuta');
                    this.keeperInitiate =
                        this.player2.findCardByName('keeper-initiate');

                    this.p1FateBefore = this.player1.fate;
                    this.p2FateBefore = this.player2.fate;
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.adeptOfTheWaves, this.kudaka],
                        defenders: [this.bayushiManipulator, this.yuta]
                    });
                    this.player2.clickPrompt('Pass');

                    this.player1.clickCard(this.mangroveSafehouse);
                });

                it('should prompt to select a character', function () {
                    expect(this.player1).toHavePrompt('Choose a character');
                });

                it('should not allow target a unit you do not control', function () {
                    expect(this.player1).not.toBeAbleToSelect(
                        this.bayushiManipulator
                    );
                    expect(this.player1).not.toBeAbleToSelect(this.yuta);
                    expect(this.player1).not.toBeAbleToSelect(
                        this.keeperInitiate
                    );
                });

                it('should not allow target a unit at home', function () {
                    expect(this.player1).not.toBeAbleToSelect(
                        this.solemnScholar
                    );
                });

                describe('if a non-Mantis character is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.adeptOfTheWaves);
                    });

                    it('moves the target home', function () {
                        expect(this.adeptOfTheWaves.inConflict).toBe(false);
                        expect(
                            this.game.currentConflict.attackers
                        ).not.toContain(this.adeptOfTheWaves);
                    });

                    it('steals no fate', function () {
                        expect(this.player1.fate).toBe(this.p1FateBefore);
                        expect(this.player2.fate).toBe(this.p2FateBefore);
                    });
                });

                describe('if a Mantis character is selected', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.kudaka);
                    });

                    it('moves the target home', function () {
                        expect(this.kudaka.inConflict).toBe(false);
                        expect(
                            this.game.currentConflict.attackers
                        ).not.toContain(this.kudaka);
                    });

                    it('steals 1 fate', function () {
                        expect(this.player1.fate).toBe(this.p1FateBefore + 1);
                        expect(this.player2.fate).toBe(this.p2FateBefore - 1);
                    });
                });
            });
        });
    });
});
