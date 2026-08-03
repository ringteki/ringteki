describe('SoD - Lion', function () {
    integration(function () {
        describe('Ancestral Rivalry', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        hand: ['ancestral-rivalry']
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.rivalry = this.player1.findCardByName('ancestral-rivalry');
            });

            it('skill bonus', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                const mil = this.ancientMaster.getMilitarySkill();
                const pol = this.ancientMaster.getPoliticalSkill();

                this.player2.pass();

                this.player1.clickCard(this.rivalry);
                this.player1.clickCard(this.ancientMaster);
                expect(this.player2).toHavePromptButton('Give the character +3/+3');
                expect(this.player2).toHavePromptButton('Let opponent claim favor');

                this.player2.clickPrompt('Give the character +3/+3');
                expect(this.ancientMaster.getMilitarySkill()).toBe(mil + 3);
                expect(this.ancientMaster.getPoliticalSkill()).toBe(pol + 3);
                expect(this.getChatLogs(5)).toContain('player1 plays Ancestral Rivalry to give Ancient Master +3military/+3political');
            });

            it('claim favor', function () {
                this.player2.player.imperialFavor = 'military';

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                const mil = this.ancientMaster.getMilitarySkill();
                const pol = this.ancientMaster.getPoliticalSkill();

                this.player2.pass();

                this.player1.clickCard(this.rivalry);
                this.player1.clickCard(this.ancientMaster);
                this.player2.clickPrompt('Let opponent claim favor');
                expect(this.ancientMaster.getMilitarySkill()).toBe(mil);
                expect(this.ancientMaster.getPoliticalSkill()).toBe(pol);
                expect(this.getChatLogs(5)).toContain('player1 plays Ancestral Rivalry to claim the Imperial Favor');
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Political');

                this.player1.clickPrompt('Political');
                expect(this.player1.player.imperialFavor).toBe('political');
                expect(this.player2.player.imperialFavor).toBe('');
                expect(this.getChatLogs(5)).toContain('player1 claims the Emperor\'s political favor!');
            });

            it('reclaim favor', function () {
                this.player1.player.imperialFavor = 'military';

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                const mil = this.ancientMaster.getMilitarySkill();
                const pol = this.ancientMaster.getPoliticalSkill();

                this.player2.pass();

                this.player1.clickCard(this.rivalry);
                this.player1.clickCard(this.ancientMaster);
                this.player2.clickPrompt('Let opponent claim favor');
                expect(this.ancientMaster.getMilitarySkill()).toBe(mil);
                expect(this.ancientMaster.getPoliticalSkill()).toBe(pol);
                expect(this.getChatLogs(5)).toContain('player1 plays Ancestral Rivalry to claim the Imperial Favor');
                expect(this.player1).toHavePromptButton('Military');
                expect(this.player1).toHavePromptButton('Political');

                this.player1.clickPrompt('Political');
                expect(this.player1.player.imperialFavor).toBe('political');
                expect(this.player2.player.imperialFavor).toBe('');
                expect(this.getChatLogs(5)).toContain('player1 claims the Emperor\'s political favor!');
            });
        });

        describe('Ikoma Natsuko', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        hand: ['ancestral-rivalry']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.rivalry = this.player1.findCardByName('ancestral-rivalry');
                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
            });

            it('should work', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko]
                });

                this.player2.clickCard(this.natsuko);
                this.player2.clickCard(this.ancientMaster);
                expect(this.ancientMaster.bowed).toBe(true);
                expect(this.ancientMaster.isParticipating()).toBe(false);
                expect(this.player2.player.imperialFavor).toBe('');
                expect(this.getChatLogs(5)).toContain('player2 uses Ikoma Natsuko, discarding the Imperial Favor to bow and send Ancient Master home');
            });

            it('cannot trigger from home', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();
                expect(this.player2).not.toBeAbleToSelect(this.natsuko);
            });
        });

        describe('Ikoma Yumikos Dagger', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master', 'doji-challenger'],
                        hand: ['ancestral-rivalry']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko', 'ikoma-yumiko-s-dagger'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.rivalry = this.player1.findCardByName('ancestral-rivalry');
                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
                this.dagger = this.player2.findCardByName('ikoma-yumiko-s-dagger');
            });

            it('prevent favor discard', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko]
                });

                this.player2.clickCard(this.natsuko);
                this.player2.clickCard(this.ancientMaster);
                expect(this.player2).toHavePrompt('Triggered Abilities');
                expect(this.player2).toBeAbleToSelect(this.dagger);
                this.player2.clickCard(this.dagger);
                expect(this.ancientMaster.bowed).toBe(true);
                expect(this.ancientMaster.isParticipating()).toBe(false);
                expect(this.player2.player.imperialFavor).toBe('military');
                expect(this.dagger.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player2 uses Ikoma Yumiko\'s Dagger to discard itself instead of the Imperial Favor');
            });

            it('injure', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster, this.challenger],
                    defenders: [this.natsuko, this.dagger]
                });

                this.player2.clickCard(this.dagger);
                expect(this.player2).toBeAbleToSelect(this.ancientMaster);
                expect(this.player2).not.toBeAbleToSelect(this.challenger);
                this.player2.clickCard(this.ancientMaster);
                expect(this.ancientMaster.location).toBe('conflict discard pile');
                expect(this.dagger.location).toBe('dynasty discard pile');
                expect(this.getChatLogs(5)).toContain('player2 uses Ikoma Yumiko\'s Dagger to injure itself and Ancient Master');
            });
        });

        describe('Imperial Adjutant', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        hand: ['imperial-adjutant']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.adjutant = this.player1.findCardByName('imperial-adjutant');
                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
                this.player1.playAttachment(this.adjutant, this.ancientMaster);
            });

            it('dishonor', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.adjutant);
                this.player1.clickCard(this.natsuko);

                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Move this character to the conflict');
                this.player2.clickPrompt('Dishonor this character');
                expect(this.getChatLogs(5)).toContain('player1 uses Imperial Adjutant, sacrificing Imperial Adjutant to dishonor Ikoma Natsuko');
                expect(this.natsuko.isDishonored).toBe(true);
                expect(this.natsuko.isParticipating()).toBe(false);
            });

            it('move', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.adjutant);
                this.player1.clickCard(this.natsuko);

                this.player2.clickPrompt('Move this character to the conflict');
                expect(this.getChatLogs(5)).toContain('player1 uses Imperial Adjutant, sacrificing Imperial Adjutant to move Ikoma Natsuko into the conflict');
                expect(this.natsuko.isDishonored).toBe(false);
                expect(this.natsuko.isParticipating()).toBe(true);
            });

            it('force', function () {
                this.natsuko.dishonor();
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();
                this.player1.clickCard(this.adjutant);
                this.player1.clickCard(this.natsuko);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player1 uses Imperial Adjutant, sacrificing Imperial Adjutant to move Ikoma Natsuko into the conflict');
                expect(this.natsuko.isDishonored).toBe(true);
                expect(this.natsuko.isParticipating()).toBe(true);
            });
        });

        describe('River Crossing', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master', 'doji-challenger'],
                        hand: ['a-perfect-cut']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko'],
                        hand: ['assassination', 'let-go'],
                        provinces: ['river-crossing']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.cut = this.player1.findCardByName('a-perfect-cut');
                this.challenger = this.player1.findCardByName('doji-challenger');
                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
                this.crossing = this.player2.findCardByName('river-crossing');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster, this.challenger],
                    province: this.crossing
                });

                this.player2.clickCard(this.crossing);
                this.player2.clickCard(this.natsuko);
                this.player2.clickPrompt('Done');
                expect(this.getChatLogs(5)).toContain('player2 uses River Crossing to make it so each character contributes 1 skill to the conflict');
                expect(this.getChatLogs(5)).toContain('player1 has initiated a military conflict with skill 2');
                expect(this.getChatLogs(5)).toContain('player2 has defended with skill 1');

                this.player2.pass();
                this.player1.clickCard(this.cut);
                this.player1.clickCard(this.challenger);
                expect(this.getChatLogs(5)).toContain('Military Air conflict - Attacker: 2 Defender: 1');
            });
        });

        describe('The Stranger', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        hand: ['ancestral-rivalry', 'the-stranger']
                    },
                    player2: {
                        inPlay: ['keeper-initiate'],
                        hand: ['assassination', 'let-go']
                    }
                });

                this.stranger = this.player1.findCardByName('the-stranger');
                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.rivalry = this.player1.findCardByName('ancestral-rivalry');
                this.player1.playAttachment(this.stranger, this.ancientMaster);
            });

            it('claim favor', function () {
                this.player2.player.imperialFavor = 'military';

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.rivalry);
                this.player1.clickCard(this.ancientMaster);
                this.player2.clickPrompt('Let opponent claim favor');
                this.player1.clickPrompt('Political');
                expect(this.player1.player.imperialFavor).toBe('political');
                expect(this.player2.player.imperialFavor).toBe('');

                const honor = this.player1.honor;

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stranger);
                this.player1.clickCard(this.stranger);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain('player1 uses The Stranger to gain 1 honor');
            });

            it('reclaim favor', function () {
                this.player1.player.imperialFavor = 'military';

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: []
                });

                this.player2.pass();

                this.player1.clickCard(this.rivalry);
                this.player1.clickCard(this.ancientMaster);
                this.player2.clickPrompt('Let opponent claim favor');
                this.player1.clickPrompt('Military');
                expect(this.player1.player.imperialFavor).toBe('military');
                expect(this.player2.player.imperialFavor).toBe('');

                const honor = this.player1.honor;

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.stranger);
                this.player1.clickCard(this.stranger);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain('player1 uses The Stranger to gain 1 honor');
            });
        });

        describe('Deeds not Words', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        hand: ['a-perfect-cut']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko', 'doji-challenger'],
                        hand: ['deeds-not-words']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
                this.deeds = this.player2.findCardByName('deeds-not-words');
            });

            it('no favor', function () {
                this.player1.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                const mil = this.natsuko.getMilitarySkill();
                this.player2.clickCard(this.deeds);
                this.player2.clickCard(this.natsuko);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player2 plays Deeds, not Words to give Ikoma Natsuko +2military');
                expect(this.natsuko.getMilitarySkill()).toBe(mil + 2);
            });

            it('discarding favor', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                const mil = this.natsuko.getMilitarySkill();
                this.player2.clickCard(this.deeds);
                this.player2.clickCard(this.natsuko);
                expect(this.getChatLogs(5)).toContain('player2 plays Deeds, not Words to give Ikoma Natsuko +2military');
                expect(this.natsuko.getMilitarySkill()).toBe(mil + 2);
                expect(this.player2).toHavePromptButton('Discard the Imperial Favor');
                expect(this.player2).toHavePromptButton('Done');

                this.player2.clickPrompt('Discard the Imperial Favor');

                expect(this.natsuko.isHonored).toBe(true);
                expect(this.player2.player.imperialFavor).toBe('');
            });

            it('not discarding favor', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                const mil = this.natsuko.getMilitarySkill();
                this.player2.clickCard(this.deeds);
                this.player2.clickCard(this.natsuko);
                expect(this.getChatLogs(5)).toContain('player2 plays Deeds, not Words to give Ikoma Natsuko +2military');
                expect(this.natsuko.getMilitarySkill()).toBe(mil + 2);
                this.player2.clickPrompt('Done');
                expect(this.player2.player.imperialFavor).toBe('military');
            });

            it('claiming favor', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                this.player2.clickCard(this.deeds);
                this.player2.clickCard(this.natsuko);
                this.player2.clickPrompt('Discard the Imperial Favor');

                this.noMoreActions();

                expect(this.player2).toHavePromptButton('Military');
                expect(this.player2).toHavePromptButton('Political');

                this.player2.clickPrompt('Political');
                expect(this.player2.player.imperialFavor).toBe('political');
                expect(this.getChatLogs(5)).toContain('player2 claims the Imperial Favor to the delayed effect of Deeds, not Words');
                expect(this.getChatLogs(5)).toContain('player2 claims the Emperor\'s political favor!');
            });

            it('losing', function () {
                this.player2.player.imperialFavor = 'military';
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                this.player2.clickCard(this.deeds);
                this.player2.clickCard(this.natsuko);
                this.player2.clickPrompt('Discard the Imperial Favor');

                this.natsuko.bow();
                this.challenger.bow();

                this.noMoreActions();

                expect(this.player1).toHavePrompt('Air Ring');
                this.player1.clickPrompt('Don\'t resolve');

                expect(this.player1).toHavePrompt('Action Window');
            });
        });

        describe('Deeds not Words played from an opponent\'s deck', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ancient-master'],
                        conflictDiscard: ['deeds-not-words', 'ready-for-battle', 'honored-blade']
                    },
                    player2: {
                        inPlay: ['ikoma-natsuko', 'doji-challenger'],
                        hand: ['a-swallow-s-return']
                    }
                });

                this.ancientMaster = this.player1.findCardByName('ancient-master');
                this.deeds = this.player1.findCardByName('deeds-not-words');
                this.readyForBattle = this.player1.findCardByName('ready-for-battle');
                this.honoredBlade = this.player1.findCardByName('honored-blade');
                this.player1.player.moveCard(this.readyForBattle, 'conflict deck');
                this.player1.player.moveCard(this.honoredBlade, 'conflict deck');
                this.player1.player.moveCard(this.deeds, 'conflict deck');

                this.natsuko = this.player2.findCardByName('ikoma-natsuko');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.swallow = this.player2.findCardByName('a-swallow-s-return');
            });

            it('gives the favor to the player who played it, not the card\'s owner', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ancientMaster],
                    defenders: [this.natsuko, this.challenger]
                });

                this.player2.clickCard(this.swallow);
                this.player2.clickPrompt('Deeds, not Words');
                this.player2.clickCard(this.natsuko);

                this.noMoreActions();

                expect(this.player2).toHavePromptButton('Military');
                expect(this.player2).toHavePromptButton('Political');
                this.player2.clickPrompt('Political');

                expect(this.player2.player.imperialFavor).toBe('political');
                expect(this.player1.player.imperialFavor).toBe('');
            });
        });
    });
});

