describe('SoD - Crane', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['observant-daidoji', 'doji-kuwanan', 'asahina-momoko', 'doomed-shugenja'],
                    hand: ['ancestral-kabuto', 'castle-of-air', 'eyes-of-the-serpent', 'two-folded-virtue', 'cloak-of-night'],
                    provinces: ['pilgrimage', 'excellence-attained']
                },
                player2: {
                    hand: ['assassination'],
                    inPlay: ['doji-challenger']
                }
            });

            this.daidoji = this.player1.findCardByName('observant-daidoji');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.cloak = this.player1.findCardByName('cloak-of-night');
            this.kuwanan.dishonor();
            this.momoko = this.player1.findCardByName('asahina-momoko');
            this.doomed = this.player1.findCardByName('doomed-shugenja');
            this.kabuto = this.player1.findCardByName('ancestral-kabuto');
            this.castle = this.player1.findCardByName('castle-of-air');
            this.serpent = this.player1.findCardByName('eyes-of-the-serpent');
            this.virtue = this.player1.findCardByName('two-folded-virtue');
            this.pilgrimage = this.player1.findCardByName('pilgrimage');
            this.excellence = this.player1.findCardByName('excellence-attained');

            this.assassination = this.player2.findCardByName('assassination');
            this.challenger = this.player2.findCardByName('doji-challenger');
        });

        describe('Castle of Air / Asahina Momoko', function () {
            it('adds to strength and prevents unopposed honor loss', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;

                this.player1.clickCard(this.castle);
                expect(this.pilgrimage.getStrength()).toBe(5);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.momoko);
                expect(this.player1).toBeAbleToSelect(this.doomed);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

                this.player1.clickCard(this.momoko);
                expect(this.pilgrimage.getStrength()).toBe(9);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Castle of Air, bowing Asahina Momoko to increase the strength of an attacked province by 4 and prevent unopposed honor loss'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player1 increases the strength of Pilgrimage'
                );

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.momoko);
                this.player1.clickCard(this.momoko);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Asahina Momoko to gain 1 honor'
                );

                this.player2.pass();
                this.player1.pass();

                expect(this.player1.honor).toBe(honor + 1);

                expect(this.getChatLogs(5)).toContain(
                    'Castle of Air cancels the honor loss'
                );
            });

            it('prevents unopposed honor loss even if assassinated', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;

                this.player1.clickCard(this.castle);
                expect(this.pilgrimage.getStrength()).toBe(5);
                expect(this.player1).toHavePrompt('Select card to bow');
                expect(this.player1).toBeAbleToSelect(this.momoko);
                expect(this.player1).toBeAbleToSelect(this.doomed);
                expect(this.player1).not.toBeAbleToSelect(this.kuwanan);

                this.player1.clickCard(this.momoko);
                expect(this.pilgrimage.getStrength()).toBe(9);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Castle of Air, bowing Asahina Momoko to increase the strength of an attacked province by 4 and prevent unopposed honor loss'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player1 increases the strength of Pilgrimage'
                );

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.momoko);
                this.player1.clickCard(this.momoko);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Asahina Momoko to gain 1 honor'
                );

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.momoko);

                this.player1.pass();
                this.player2.pass();

                expect(this.player1.honor).toBe(honor + 1);

                expect(this.getChatLogs(5)).toContain(
                    'Castle of Air cancels the honor loss'
                );
            });

            it('no affinity', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;

                this.player1.pass();
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.momoko);

                this.player1.clickCard(this.castle);
                expect(this.pilgrimage.getStrength()).toBe(5);
                expect(this.player1).toHavePrompt('Select card to bow');
                this.player1.clickCard(this.doomed);
                expect(this.pilgrimage.getStrength()).toBe(9);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Castle of Air, bowing Doomed Shugenja to increase the strength of an attacked province by 4'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player1 increases the strength of Pilgrimage'
                );

                this.player2.pass();
                this.player1.pass();

                expect(this.player1.honor).toBe(honor - 1);

                expect(this.getChatLogs(5)).not.toContain(
                    'Castle of Air cancels the honor loss'
                );
            });
        });

        describe('Eyes of the Serpent', function () {
            it('taints and gives honor', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;
                let fate = this.player1.fate;

                this.player1.clickCard(this.serpent);
                expect(this.player1).toHavePrompt('Eyes of the Serpent');
                expect(this.player1).toBeAbleToSelect(this.kuwanan);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);

                this.player1.clickCard(this.kuwanan);
                expect(this.player1).toHavePromptButton('Spend 1 honor');
                expect(this.player1).toHavePromptButton('Spend 1 fate');

                this.player1.clickPrompt('Spend 1 fate');

                expect(this.kuwanan.isTainted).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Eyes of the Serpent, paying 1 fate to taint Doji Kuwanan'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player1 channels their air affinity to gain 1 honor'
                );

                expect(this.player1.fate).toBe(fate - 1);
                expect(this.player1.honor).toBe(honor + 1);
            });

            it('spending honor', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;
                let fate = this.player1.fate;

                this.player1.clickCard(this.serpent);
                this.player1.clickCard(this.kuwanan);
                this.player1.clickPrompt('Spend 1 honor');
                expect(this.kuwanan.isTainted).toBe(true);
                expect(this.getChatLogs(5)).toContain(
                    'player1 plays Eyes of the Serpent, paying 1 honor to taint Doji Kuwanan'
                );
                expect(this.getChatLogs(5)).toContain(
                    'player1 channels their air affinity to gain 1 honor'
                );

                expect(this.player1.fate).toBe(fate);
                expect(this.player1.honor).toBe(honor);
            });
        });

        describe('Ancestral Kabuto', function () {
            it('sets glory to 0 prevents it being changed', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                this.player1.clickCard(this.kabuto);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.glory).toBe(0);

                this.player2.pass();

                this.player1.clickCard(this.cloak);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.glory).toBe(0);

                this.player1.clickCard(this.momoko);

                this.kuwanan.honor();
                this.player2.pass();

                expect(this.kuwanan.glory).toBe(6);
            });

            it('gains honor when winning if dishonored', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                this.player1.clickCard(this.kabuto);
                this.player1.clickCard(this.kuwanan);
                this.player2.pass();
                this.player1.pass();

                let honor = this.player1.honor;

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.kabuto);
                this.player1.clickCard(this.kabuto);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain('player1 uses Ancestral Kabuto to gain 1 honor');
            });

            it('does not gain honor when winning if not dishonored', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                this.player1.clickCard(this.kabuto);
                this.player1.clickCard(this.kuwanan);
                this.kuwanan.honor();
                this.player2.pass();
                this.player1.pass();

                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Observant Daidoji', function () {
            it('can be assassinated', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                this.player1.pass();
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.daidoji);

                expect(this.daidoji.location).toBe('dynasty discard pile');
            });

            it('cant be assassinated while dishonored', function () {
                this.daidoji.dishonor();

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                this.player1.pass();
                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.daidoji);

                expect(this.daidoji.location).toBe('play area');
            });
        });

        describe('Two Folded Virtue', function () {
            it('gives +2 skill and doesnt give honor if you win', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.kuwanan],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;
                const mil = this.kuwanan.getMilitarySkill();
                this.player1.clickCard(this.virtue);
                this.player1.clickCard(this.kuwanan);
                expect(this.kuwanan.getMilitarySkill()).toBe(mil + 2);
                expect(this.getChatLogs(5)).toContain('player1 plays Two-Folded Virtue to grant +2military to Doji Kuwanan and, if they lose the current conflict, gain 1 honor');

                this.noMoreActions();

                expect(this.player1.honor).toBe(honor);
            });

            it('gives +2 skill and gives honor if you lose', function () {
                this.challenger.honor();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.challenger],
                    defenders: [this.daidoji],
                    type: 'military',
                    province: this.pilgrimage
                });

                let honor = this.player1.honor;
                this.player1.clickCard(this.virtue);
                this.player1.clickCard(this.daidoji);
                this.noMoreActions();

                expect(this.player1.honor).toBe(honor + 1);

                expect(this.getChatLogs(5)).toContain('player1 gains 1 honor due to the delayed effect of Two-Folded Virtue');
            });
        });
    });
});

describe('Excellence Attained', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['adept-of-the-waves']
                },
                player2: {
                    inPlay: ['border-rider', 'battle-maiden-recruit'],
                    hand: [
                        'fine-katana',
                        'finger-of-jade',
                        'tattooed-wanderer',
                        'force-of-the-river',
                        'censure',
                        'talisman-of-the-sun'
                    ],
                    provinces: ['excellence-attained']
                }
            });

            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');

            this.borderRider = this.player2.findCardByName('border-rider');
            this.battleMaidenRecruit = this.player2.findCardByName('battle-maiden-recruit');
            this.fineKatana = this.player2.findCardByName('fine-katana', 'hand');
            this.fingerOfJade = this.player2.findCardByName('finger-of-jade', 'hand');
            this.tattooedWanderer = this.player2.findCardByName('tattooed-wanderer', 'hand');
            this.forceOfTheRiver = this.player2.findCardByName('force-of-the-river', 'hand');
            this.censure = this.player2.findCardByName('censure', 'hand');
            this.talismanOfTheSun = this.player2.findCardByName('talisman-of-the-sun', 'hand');

            this.player2.player.moveCard(this.censure, 'conflict deck');
            this.player2.player.moveCard(this.fineKatana, 'conflict deck');
            this.player2.player.moveCard(this.fingerOfJade, 'conflict deck');
            this.player2.player.moveCard(this.tattooedWanderer, 'conflict deck');
            this.player2.player.moveCard(this.forceOfTheRiver, 'conflict deck');

            this.excellence = this.player2.findCardByName('excellence-attained', 'province 1');
            this.shamefulDisplay = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('should trigger when province is revealed', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.excellence);
        });

        it('should prompt to choose an eligible attachment', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            this.player2.clickCard(this.excellence);
            expect(this.player2).toHavePrompt('Choose an attachment');
            expect(this.player2).not.toHavePromptButton('Censure');
            expect(this.player2).toHavePromptButton('Fine Katana');
            expect(this.player2).toHavePromptButton('Finger of Jade');
            expect(this.player2).not.toHavePromptButton('Tattooed Wanderer');
            expect(this.player2).not.toHavePromptButton('Force of the River');
            expect(this.player2).toHavePromptButton('Take nothing');
        });

        it('should prompt to choose to take nothing', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            this.player2.clickCard(this.excellence);
            expect(this.player2).toHavePrompt('Choose an attachment');
            expect(this.player2).toHavePromptButton('Take nothing');
            this.player2.clickPrompt('Take nothing');
            expect(this.getChatLogs(3)).toContain('player2 takes nothing');
            expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
            expect(this.player2).toHavePrompt('Choose defenders');
        });

        it('should prompt to choose a character to attach to', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            this.player2.clickCard(this.excellence);
            this.player2.clickPrompt('Fine Katana');
            expect(this.player2).toHavePrompt('Choose a character');
            expect(this.player2).toBeAbleToSelect(this.borderRider);
            expect(this.player2).toBeAbleToSelect(this.battleMaidenRecruit);
            expect(this.player2).toBeAbleToSelect(this.adeptOfTheWaves);
        });

        it('should attach the chosen attachment to the chosen character and shuffle the deck', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            this.player2.clickCard(this.excellence);
            this.player2.clickPrompt('Fine Katana');
            this.player2.clickCard(this.borderRider);
            expect(this.borderRider.attachments).toContain(this.fineKatana);
            expect(this.player2).toHavePrompt('Choose defenders');
            expect(this.getChatLogs(3)).toContain('player2 chooses to attach Fine Katana to Border Rider');
            expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
        });

        it('should still prompt and shuffle the deck if there are no attachments in the top 5', function () {
            this.player2.player.moveCard(this.censure, 'hand');
            this.player2.player.moveCard(this.fineKatana, 'hand');
            this.player2.player.moveCard(this.fingerOfJade, 'hand');
            this.player2.player.moveCard(this.tattooedWanderer, 'hand');
            this.player2.player.moveCard(this.forceOfTheRiver, 'hand');
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptOfTheWaves]
            });
            expect(this.player2).toHavePrompt('Triggered Abilities');
            expect(this.player2).toBeAbleToSelect(this.excellence);
            this.player2.clickCard(this.excellence);
            expect(this.player2).toHavePrompt('Choose an attachment');
            expect(this.player2).toHavePromptButton('Take nothing');
            expect(this.player2).toHaveDisabledPromptButton('Supernatural Storm (5)');
            expect(this.getChatLogs(1)).toContain(
                'player2 uses Excellence, Attained to search the top 5 cards of their conflict deck for an attachment and put it into play'
            );
            this.player2.clickPrompt('Take nothing');
            expect(this.getChatLogs(3)).toContain('player2 takes nothing');
            expect(this.getChatLogs(2)).toContain('player2 is shuffling their conflict deck');
        });
    });
});

describe('SoD - Two-Folded Virtue played from an opponent\'s deck', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ancient-master'],
                    conflictDiscard: ['two-folded-virtue', 'ready-for-battle', 'honored-blade']
                },
                player2: {
                    inPlay: ['ikoma-natsuko', 'doji-challenger'],
                    hand: ['a-swallow-s-return']
                }
            });

            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.virtue = this.player1.findCardByName('two-folded-virtue');
            this.readyForBattle = this.player1.findCardByName('ready-for-battle');
            this.honoredBlade = this.player1.findCardByName('honored-blade');
            this.player1.player.moveCard(this.readyForBattle, 'conflict deck');
            this.player1.player.moveCard(this.honoredBlade, 'conflict deck');
            this.player1.player.moveCard(this.virtue, 'conflict deck');

            this.natsuko = this.player2.findCardByName('ikoma-natsuko');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.swallow = this.player2.findCardByName('a-swallow-s-return');
        });

        it('honors the player who played it, not the card\'s owner', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ancientMaster],
                defenders: [this.natsuko, this.challenger]
            });

            this.player2.clickCard(this.swallow);
            this.player2.clickPrompt('Two-Folded Virtue');
            this.player2.clickCard(this.challenger);

            this.natsuko.bow();
            this.challenger.bow();
            const honor1 = this.player1.honor;
            const honor2 = this.player2.honor;

            this.noMoreActions();

            expect(this.player2.honor).toBe(honor2 + 1);
            expect(this.player1.honor).toBe(honor1);
        });
    });
});
