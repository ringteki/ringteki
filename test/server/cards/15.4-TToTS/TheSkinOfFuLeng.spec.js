describe('The Skin of Fu Leng', function() {
    integration(function() {
        describe('Attaching Restriction', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['kakita-toshimoko', 'doji-challenger', 'bayushi-kachiko-2'],
                        hand: ['the-skin-of-fu-leng'],
                    },
                    player2: {
                        inPlay: ['bayushi-kachiko']
                    }
                });

                this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                this.kachiko = this.player2.findCardByName('bayushi-kachiko');
            });

            it('should allow you to attach to a unique character you control', function() {
                this.player1.clickCard(this.skin);
                expect(this.player1).toBeAbleToSelect(this.toshimoko);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                expect(this.player1).not.toBeAbleToSelect(this.kachiko);
            });
        });

        describe('Gaining Abilities', function() {
            /*
                Brash Samurai (I have no participating characters, my opponent just has Brash) - Should trigger
                Brash Samurai (I have a character, my opponent just has Brash) - Should not trigger
                Brash Samurai (I have no participating characters, my opponent has Brash + something) - Should not trigger
            */
            describe('Participating Alone', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko'],
                            hand: ['the-skin-of-fu-leng'],
                        },
                        player2: {
                            inPlay: ['brash-samurai', 'doji-challenger']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.brash = this.player2.findCardByName('brash-samurai');
                    this.challenger = this.player2.findCardByName('doji-challenger');

                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                // it('should not allow you to trigger if you control a character', function() {
                //     this.noMoreActions();
                //     this.initiateConflict({
                //         type: 'military',
                //         attackers: [this.toshimoko],
                //         defenders: [this.brash]
                //     });
                //     this.player2.pass();
                //     expect(this.player1).toHavePrompt('Conflict Action Window');
                //     this.player1.clickCard(this.brash);
                //     expect(this.player1).toHavePrompt('Conflict Action Window');
                //     expect(this.brash.isHonored).toBe(false);
                // });

                it('should allow you to trigger if it is participating alone', function() {
                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.brash],
                        defenders: []
                    });
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.brash);
                    expect(this.player2).toHavePrompt('Conflict Action Window');
                    expect(this.brash.isHonored).toBe(true);
                });

                // it('should allow you to trigger if it is not participating alone if you have no characters', function() {
                //     this.noMoreActions();
                //     this.player1.passConflict();
                //     this.noMoreActions();
                //     this.initiateConflict({
                //         type: 'military',
                //         attackers: [this.brash, this.challenger],
                //         defenders: []
                //     });
                //     expect(this.player1).toHavePrompt('Conflict Action Window');
                //     this.player1.clickCard(this.brash);
                //     expect(this.player2).toHavePrompt('Conflict Action Window');
                //     expect(this.brash.isHonored).toBe(true);
                // });
            });

            /*
                Doji Challenger (defending) - While this character is attacking: no trigger.
                Doji Challenger (attacking) - While this character is attacking: should trigger.  I should choose their character
            */
            describe('While this character is attacking', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko'],
                            hand: ['the-skin-of-fu-leng'],
                        },
                        player2: {
                            inPlay: ['brash-samurai', 'doji-challenger']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.brash = this.player2.findCardByName('brash-samurai');
                    this.challenger = this.player2.findCardByName('doji-challenger');

                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                it('should not allow you to trigger if it is defending', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.toshimoko],
                        defenders: [this.challenger]
                    });
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.challenger);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should allow you to trigger if it is attacking', function() {
                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.challenger],
                        defenders: []
                    });
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.challenger);
                    expect(this.player1).toHavePrompt('Doji Challenger');
                    expect(this.player1).not.toBeAbleToSelect(this.challenger);
                    expect(this.player1).toBeAbleToSelect(this.brash);
                    expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
                    expect(this.game.currentConflict.attackers).not.toContain(this.brash);
                    this.player1.clickCard(this.brash);
                    expect(this.game.currentConflict.attackers).toContain(this.brash);

                    expect(this.getChatLogs(5)).toContain('player1 uses Doji Challenger to move Brash Samurai into the conflict');
                });
            });

            /*
                Guardian Kami (defending) (sacrifice cost) - Should trigger
                Guardian Kami (attacking) - no trigger
            */
            describe('While this character is defending (+ sacrifice cost)', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko'],
                            hand: ['the-skin-of-fu-leng'],
                        },
                        player2: {
                            inPlay: ['guardian-kami']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.kami = this.player2.findCardByName('guardian-kami');

                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                it('should allow you to trigger if it is defending', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.toshimoko],
                        defenders: [this.kami],
                        ring: 'air'
                    });
                    let honor = this.player1.honor;
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.kami);
                    expect(this.player1).toHavePrompt('Air Ring');
                    this.player1.clickPrompt('Gain 2 honor');
                    expect(this.player1.honor).toBe(honor + 2);
                    expect(this.getChatLogs(5)).toContain('player1 uses Guardian Kami, sacrificing Guardian Kami to resolve Air Ring');
                });

                it('should not allow you to trigger if it is attacking', function() {
                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.kami],
                        defenders: [this.toshimoko]
                    });
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                    this.player1.clickCard(this.kami);
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });
            
            /*
                Hida O-Ushi (defending, opponent wins conflict) - no trigger
                Hida O-Ushi (defending, I win conflict) - no trigger
                Hida O-Ushi (attacking, opponent wins conflict) - no trigger
                Hida O-Ushi (attacking, I win conflict) - should trigger, I get the extra conflict
            */
            describe('After you win a conflict as the defending player', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko', 'doji-whisperer'],
                            hand: ['the-skin-of-fu-leng'],
                        },
                        player2: {
                            inPlay: ['hida-o-ushi', 'togashi-acolyte']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.whisperer = this.player1.findCardByName('doji-whisperer');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.oushi = this.player2.findCardByName('hida-o-ushi');
                    this.acolyte = this.player2.findCardByName('togashi-acolyte');

                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                it('should not allow you to trigger if you lose as the attacker', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.whisperer],
                        defenders: [this.oushi],
                        type: 'military'
                    });
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Action Window');
                });

                it('should not allow you to trigger if you win as the attacker', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.toshimoko],
                        defenders: [this.oushi],
                        type: 'military'
                    });
                    this.noMoreActions();
                    this.player1.clickPrompt('Don\'t Resolve');
                    expect(this.player1).toHavePrompt('Action Window');
                });

                it('should not allow you to trigger if you lose as the defender', function() {
                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.acolyte],
                        defenders: [],
                        type: 'military'
                    });
                    this.noMoreActions();
                    this.player2.clickPrompt('Don\'t Resolve');
                    expect(this.player1).toHavePrompt('Action Window');
                });

                it('should allow you to trigger if you win as the defender', function() {
                    this.noMoreActions();
                    this.player1.passConflict();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.oushi],
                        defenders: [this.toshimoko],
                        type: 'military'
                    });

                    let conflicts = this.player1.player.getConflictOpportunities();
                    let milConflicts = this.player1.player.getRemainingConflictOpportunitiesForType('military');

                    let conflicts2 = this.player2.player.getConflictOpportunities();
                    let milConflicts2 = this.player2.player.getRemainingConflictOpportunitiesForType('military');

                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.oushi);
                    this.player1.clickCard(this.oushi);
                    expect(this.getChatLogs(5)).toContain('player1 uses Hida O-Ushi to allow player1 to declare an additional military conflict this phase');

                    expect(this.player1.player.getConflictOpportunities()).toBe(conflicts + 1);
                    expect(this.player1.player.getRemainingConflictOpportunitiesForType('military')).toBe(milConflicts + 1);

                    expect(this.player2.player.getConflictOpportunities()).toBe(conflicts2);
                    expect(this.player2.player.getRemainingConflictOpportunitiesForType('military')).toBe(milConflicts2);
                });
            });

            /*
                Tadaka2 - should use my removed from game pile
                Inferno Guard Invoker (Choose a character you control) - should not be able to choose itself
                Honored General (via charge) - I should get to choose whether to trigger
            */
            describe('Some general stuff', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko'],
                            hand: ['the-skin-of-fu-leng'],
                            dynastyDiscard: ['doji-whisperer']
                        },
                        player2: {
                            inPlay: ['inferno-guard-invoker', 'isawa-tadaka-2', 'daidoji-uji'],
                            hand: ['charge'],
                            dynastyDiscard: ['honored-general']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.whisperer = this.player1.findCardByName('doji-whisperer');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.invoker = this.player2.findCardByName('inferno-guard-invoker');
                    this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                    this.general = this.player2.placeCardInProvince('honored-general', 'province 1');
                    this.charge = this.player2.findCardByName('charge');
                    this.uji = this.player2.findCardByName('daidoji-uji');

                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                it('should use your own resources if they aren\'t elements on the card', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.toshimoko],
                        defenders: [],
                        type: 'military'
                    });

                    this.player2.pass();
                    this.player1.clickCard(this.tadaka);
                    expect(this.player1).toBeAbleToSelect(this.whisperer);
                    this.player1.clickCard(this.whisperer);
                    this.player1.clickPrompt('Done');
                    expect(this.player1).toHavePromptButton('Charge!');
                    this.player1.clickPrompt('Charge!');
                    expect(this.charge.location).toBe('conflict discard pile');
                });

                it('Choose a character you control - should not allow you to choose the character triggering the ability', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.toshimoko],
                        defenders: [this.invoker],
                        type: 'military'
                    });
                    this.player2.pass();
                    this.player1.clickCard(this.invoker);
                    expect(this.player1).not.toBeAbleToSelect(this.invoker);
                    expect(this.player1).not.toBeAbleToSelect(this.tadaka);
                    expect(this.player1).toBeAbleToSelect(this.toshimoko);
                    this.player1.clickCard(this.toshimoko);
                    expect(this.toshimoko.isHonored).toBe(true);
                });

                it('should work on characters entering play without fate', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.toshimoko],
                        defenders: [],
                        type: 'military'
                    });
                    this.player2.clickCard(this.charge);
                    this.player2.clickCard(this.general);
                    expect(this.player1).toHavePrompt('Triggered Abilities');
                    expect(this.player1).toBeAbleToSelect(this.general);
                    this.player1.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });

                it('should not work on characters entering play with fate', function() {
                    this.uji.honor();
                    this.noMoreActions();
                    this.initiateConflict({
                        attackers: [this.toshimoko],
                        defenders: [],
                        type: 'military'
                    });
                    this.player2.clickCard(this.general);
                    this.player2.clickPrompt('1');
                    this.player2.clickPrompt('Conflict');
                    expect(this.player2).toHavePrompt('Triggered Abilities');
                    expect(this.player2).toBeAbleToSelect(this.general);
                    this.player2.pass();
                    expect(this.player1).toHavePrompt('Conflict Action Window');
                });
            });

            /*
                Ujina - Should trigger.  I should get to choose the target.
            */
            describe('Forced Abilities', function() {
                beforeEach(function() {
                    this.setupTest({
                        phase: 'conflict',
                        player1: {
                            inPlay: ['kakita-toshimoko'],
                            hand: ['the-skin-of-fu-leng'],
                        },
                        player2: {
                            inPlay: ['isawa-ujina']
                        }
                    });

                    this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
                    this.skin = this.player1.findCardByName('the-skin-of-fu-leng');
                    this.ujina = this.player2.findCardByName('isawa-ujina');
                    this.player1.playAttachment(this.skin, this.toshimoko);
                });

                it('should let you pick targets for forced abilities', function() {
                    this.noMoreActions();
                    this.initiateConflict({
                        type: 'military',
                        attackers: [this.toshimoko],
                        defenders: [this.ujina],
                        ring: 'void'
                    });
                    this.noMoreActions();
                    expect(this.player1).toHavePrompt('Isawa Ujina');
                    expect(this.player1).toBeAbleToSelect(this.ujina);
                    expect(this.player1).toBeAbleToSelect(this.toshimoko);
                    this.player1.clickCard(this.ujina);
                    expect(this.getChatLogs(5)).toContain('player1 uses Isawa Ujina to remove Isawa Ujina from the game');
                });
            });
        });
    });
});


/*
    Cards that refer to their controller's game state
    =============
    Pious Guardian - should check my provinces, not my opponents
    Mitsu2 - should check the number of cards I've played, not my opponent
    Kageyu - should check the number of cards my opponent has played, not myself

    Gained Abilities
    ================
    Should trigger

    Duels
    =====
    Kaezin targeting - My opponent should choose a character they control that is not Kaezin.
    Duel - my bid should apply to Kaezin, my opponent's should apply to their character
    Duel resolution - if I win should move everyone except the two characters.  If they win should move Kaezin home.
    Kyuden Kakita - should trigger and let you choose Kaezin or the other character

    Raitsugu targeting - I should be able to choose a character my opponent controls that is not Raitsugu

    Yakamo with Duelist Training - Should use my honor to determine the "cannot lose a duel"
*/