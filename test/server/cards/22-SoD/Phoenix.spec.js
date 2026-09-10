describe('SoD - Phoenix', function () {
    integration(function () {
        describe('Appeasing the Restless', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['isawa-tadaka'],
                        hand: ['ishiken-initiate', 'guardian-kami', 'kami-unleashed', 'appeasing-the-restless', 'jealous-ancestor', 'onibi']
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.tadaka = this.player1.findCardByName('isawa-tadaka');
                this.initiate = this.player1.findCardByName('ishiken-initiate');
                this.guardian = this.player1.findCardByName('guardian-kami');
                this.kami = this.player1.findCardByName('kami-unleashed');
                this.ancestor = this.player1.findCardByName('jealous-ancestor');
                this.onibi = this.player1.findCardByName('onibi');

                this.restless = this.player1.findCardByName('appeasing-the-restless');

                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');
            });

            it('should not be able to play with no spirits', function () {
                this.player1.clickCard(this.restless);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('one spirit', function () {
                this.tadaka.fate = 2;

                this.player1.clickCard(this.kami);
                this.player1.clickPrompt('0');
                this.player2.pass();

                let fate = this.player1.fate;

                this.player1.clickCard(this.restless);
                expect(this.player1).toBeAbleToSelect(this.tadaka);
                this.player1.clickCard(this.tadaka);

                expect(this.player1).toBeAbleToSelect(this.kami);
                expect(this.player1).not.toBeAbleToSelect(this.tadaka);

                this.player1.clickCard(this.kami);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.kami.fate).toBe(1);
                expect(this.tadaka.fate).toBe(1);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.getChatLogs(5)).toContain('player1 plays Appeasing the Restless, bowing Isawa Tadaka to choose up to 3 spirits to place fate on and injure Isawa Tadaka');
                expect(this.getChatLogs(5)).toContain('player1 moves fate from their pool onto Kami Unleashed');
            });

            it('four spirits', function () {
                this.player1.clickCard(this.kami);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.guardian);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.onibi);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.onibi);
                this.player2.pass();

                this.player1.clickCard(this.ancestor);
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.fate = 10;
                let fate = this.player1.fate;

                this.player1.clickCard(this.restless);
                expect(this.player1).toBeAbleToSelect(this.tadaka);
                this.player1.clickCard(this.tadaka);

                this.player1.clickCard(this.kami);
                this.player1.clickCard(this.onibi);
                this.player1.clickCard(this.guardian);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.kami.fate).toBe(1);
                expect(this.onibi.fate).toBe(2);
                expect(this.guardian.fate).toBe(1);
                expect(this.tadaka.location).toBe('dynasty discard pile');
                expect(this.player1.fate).toBe(fate - 3);
                expect(this.getChatLogs(5)).toContain('player1 plays Appeasing the Restless, bowing Isawa Tadaka to choose up to 3 spirits to place fate on and injure Isawa Tadaka');
                expect(this.getChatLogs(5)).toContain('player1 moves fate from their pool onto Kami Unleashed, Onibi and Guardian Kami');
            });

            it('not enough fate', function () {
                this.player1.clickCard(this.kami);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.guardian);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.onibi);
                this.player1.clickPrompt('0');
                this.player1.clickCard(this.onibi);
                this.player2.pass();

                this.player1.clickCard(this.ancestor);
                this.player1.clickPrompt('Play this character');
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.fate = 1;
                let fate = this.player1.fate;

                this.player1.clickCard(this.restless);
                expect(this.player1).toBeAbleToSelect(this.tadaka);
                this.player1.clickCard(this.tadaka);

                this.player1.clickCard(this.kami);
                this.player1.clickCard(this.onibi);
                this.player1.clickCard(this.guardian);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.kami.fate).toBe(1);
                expect(this.onibi.fate).toBe(1);
                expect(this.guardian.fate).toBe(0);
                expect(this.tadaka.location).toBe('dynasty discard pile');
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.getChatLogs(5)).toContain('player1 plays Appeasing the Restless, bowing Isawa Tadaka to choose up to 3 spirits to place fate on and injure Isawa Tadaka');
                expect(this.getChatLogs(5)).toContain('player1 moves fate from their pool onto Kami Unleashed');
            });

            it('void affinity', function () {
                this.tadaka.fate = 2;

                this.player1.clickCard(this.kami);
                this.player1.clickPrompt('0');
                this.player2.pass();

                this.player1.clickCard(this.initiate);
                this.player1.clickPrompt('0');
                this.player2.pass();

                let fate = this.player1.fate;

                this.player1.clickCard(this.restless);
                expect(this.player1).toBeAbleToSelect(this.tadaka);
                this.player1.clickCard(this.tadaka);

                expect(this.player1).toBeAbleToSelect(this.kami);
                expect(this.player1).not.toBeAbleToSelect(this.tadaka);

                this.player1.clickCard(this.kami);
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickPrompt('Done');

                expect(this.kami.fate).toBe(1);
                expect(this.tadaka.fate).toBe(2);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.getChatLogs(5)).toContain('player1 plays Appeasing the Restless, bowing Isawa Tadaka to choose up to 3 spirits to place fate on');
                expect(this.getChatLogs(5)).toContain('player1 moves fate from their pool onto Kami Unleashed');
            });
        });

        describe('Tessen of the Tsumani Legion', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger', 'solemn-scholar', 'brash-samurai'],
                        hand: ['tessen-of-the-tsunami-legion']
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.tessen = this.player1.findCardByName('tessen-of-the-tsunami-legion');
                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.brash = this.player1.findCardByName('brash-samurai');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.training = this.player2.findCardByName('duelist-training');
            });

            it('should work', function () {
                this.player1.clickCard(this.tessen);
                expect(this.player1).toBeAbleToSelect(this.scholar);
                expect(this.player1).not.toBeAbleToSelect(this.rumormonger);
                expect(this.player1).not.toBeAbleToSelect(this.brash);

                this.player1.clickCard(this.scholar);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    defenders: [this.challenger]
                });

                expect(this.scholar.getTraits()).toContain('water');

                this.player2.pass();
                this.player1.clickCard(this.scholar);
                expect(this.player1).toBeAbleToSelect(this.brash);
                expect(this.player1).not.toBeAbleToSelect(this.rumormonger);
                expect(this.player1).not.toBeAbleToSelect(this.scholar);
                expect(this.player1).not.toBeAbleToSelect(this.challenger);
                this.player1.clickCard(this.brash);

                expect(this.brash.getMilitarySkill()).toBe(4);
                expect(this.brash.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Solemn Scholar\'s gained ability from Tessen of the Tsunami Legion to give Brash Samurai +2military and move it to the conflict');
            });

            it('move home', function () {
                this.player1.clickCard(this.tessen);
                this.player1.clickCard(this.scholar);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash],
                    defenders: [this.challenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.scholar);
                this.player1.clickCard(this.brash);

                expect(this.brash.getMilitarySkill()).toBe(4);
                expect(this.brash.isParticipating()).toBe(false);
                expect(this.getChatLogs(5)).toContain('player1 uses Solemn Scholar\'s gained ability from Tessen of the Tsunami Legion to give Brash Samurai +2military and move it home');
            });

            it('same location', function () {
                this.player1.clickCard(this.tessen);
                this.player1.clickCard(this.scholar);

                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.brash, this.scholar],
                    defenders: [this.challenger]
                });

                this.player2.pass();
                this.player1.clickCard(this.scholar);
                this.player1.clickCard(this.brash);

                expect(this.brash.getMilitarySkill()).toBe(4);
                expect(this.brash.isParticipating()).toBe(true);
                expect(this.getChatLogs(5)).toContain('player1 uses Solemn Scholar\'s gained ability from Tessen of the Tsunami Legion to give Brash Samurai +2military');
            });
        });

        describe('Benevolent Lesser Kami', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['bayushi-rumormonger', 'benevolent-lesser-kami'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-diplomat'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.kami = this.player1.findCardByName('benevolent-lesser-kami');
                this.rumormonger = this.player1.findCardByName('bayushi-rumormonger');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.diplomat = this.player2.findCardByName('doji-diplomat');
                this.training = this.player2.findCardByName('duelist-training');

                this.player2.player.moveCard(this.training, 'conflict deck');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.kami],
                    defenders: [this.diplomat]
                });

                expect(this.kami.getMilitarySkill()).toBe(1);
                expect(this.kami.getPoliticalSkill()).toBe(1);

                this.player2.pass();
                this.player1.clickCard(this.kami);
                expect(this.player1).toHavePromptButton('Gain an elemental trait');
                expect(this.player1).toHavePromptButton('Shuffle into deck');

                this.player1.clickPrompt('Gain an elemental trait');
                expect(this.player1).toHavePromptButton('Air');
                expect(this.player1).toHavePromptButton('Earth');
                expect(this.player1).toHavePromptButton('Fire');
                expect(this.player1).toHavePromptButton('Void');
                expect(this.player1).toHavePromptButton('Water');

                // Shameful Display is a void province; the ring is air, and the ring
                // is not what the card looks at.
                this.player1.clickPrompt('Air');

                expect(this.kami.getMilitarySkill()).toBe(1);
                expect(this.kami.getPoliticalSkill()).toBe(1);

                expect(this.getChatLogs(5)).toContain('player1 uses Benevolent Lesser Kami to gain the Air trait');
            });

            it('gets the bonus for the attacked province\'s element', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'air',
                    attackers: [this.kami],
                    defenders: [this.diplomat]
                });

                expect(this.kami.getMilitarySkill()).toBe(1);

                this.player2.pass();
                this.player1.clickCard(this.kami);
                this.player1.clickPrompt('Gain an elemental trait');
                this.player1.clickPrompt('Void');

                expect(this.kami.getMilitarySkill()).toBe(2);
                expect(this.kami.getPoliticalSkill()).toBe(2);
            });

            it('shuffle', function () {
                this.player1.clickCard(this.kami);
                expect(this.kami.location).toBe('conflict deck');
                expect(this.getChatLogs(5)).toContain('player1 uses Benevolent Lesser Kami to shuffle Benevolent Lesser Kami into its owner\'s deck');
                expect(this.getChatLogs(5)).toContain('player1 is shuffling their conflict deck');
            });
        });

        describe('Asako Shun', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['asako-shun', 'solemn-scholar'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.shun = this.player1.findCardByName('asako-shun');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.training = this.player2.findCardByName('duelist-training');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shun],
                    defenders: [this.challenger]
                });

                let honor = this.player1.honor;

                this.player2.pass();
                this.player1.clickCard(this.shun);
                this.player1.clickCard(this.challenger);

                expect(this.challenger.getMilitarySkill()).toBe(1);
                expect(this.challenger.getPoliticalSkill()).toBe(1);
                expect(this.player1.honor).toBe(honor);
                expect(this.getChatLogs(5)).toContain('player1 uses Asako Shun to give Doji Challenger -2military and -2political');
            });

            it('honor', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.shun, this.scholar],
                    defenders: [this.challenger]
                });

                let honor = this.player1.honor;

                this.player2.pass();
                this.player1.clickCard(this.shun);
                this.player1.clickCard(this.challenger);

                expect(this.challenger.getMilitarySkill()).toBe(0);
                expect(this.challenger.getPoliticalSkill()).toBe(0);
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain('player1 uses Asako Shun to give Doji Challenger -4military and -4political');
                expect(this.getChatLogs(5)).toContain('player1 gains 1 honor because Doji Challenger is not contributing skill to the current conflict');
            });

            it('cannot trigger from home', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    defenders: [this.challenger]
                });

                this.player2.pass();
                expect(this.player1).not.toBeAbleToSelect(this.shun);
            });
        });

        describe('Song of the Empty City', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['keeper-initiate', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training'],
                        dynastyDiscard: ['song-of-the-empty-city']
                    }
                });

                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.keeper = this.player2.findCardByName('keeper-initiate');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.song = this.player2.findCardByName('song-of-the-empty-city');
                this.player2.placeCardInProvince(this.song, 'province 1');

                this.song.facedown = false;

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    province: this.p1
                });

                let honor = this.player2.honor;

                expect(this.player2).toBeAbleToSelect(this.song);
                this.player2.clickCard(this.song);

                expect(this.player2.honor).toBe(honor + 1);
                expect(this.getChatLogs(5)).toContain('player2 uses Song of the Empty City to gain 1 honor');
            });

            it('moving to province after conflict', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    defenders: [this.challenger],
                    province: this.p3
                });

                this.noMoreActions();
                this.player1.pass();
                this.scholar.bowed = false;
                this.challenger.bowed = false;
                this.player2.clickCard(this.song);
                this.player2.clickCard(this.p3);

                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    province: this.p3,
                    ring: 'fire'
                });

                let honor = this.player2.honor;

                expect(this.player2).toBeAbleToSelect(this.song);
                this.player2.clickCard(this.song);

                expect(this.player2.honor).toBe(honor + 2);
                expect(this.getChatLogs(5)).toContain('player2 uses Song of the Empty City to gain 2 honor');
            });
        });

        describe('Vengeful Kami', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['solemn-scholar'],
                        hand: []
                    },
                    player2: {
                        inPlay: ['vengeful-kami', 'doji-challenger'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.challenger = this.player2.findCardByName('doji-challenger');
                this.vengeful = this.player2.findCardByName('vengeful-kami');

                this.scholar.fate = 1;

                this.p1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.p2 = this.player2.findCardByName('shameful-display', 'province 2');
                this.p3 = this.player2.findCardByName('shameful-display', 'province 3');
                this.p4 = this.player2.findCardByName('shameful-display', 'province 4');
            });

            it('should work', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    defenders: [this.vengeful],
                    province: this.p3
                });

                this.player2.clickCard(this.vengeful);
                expect(this.player2).toHavePrompt('Conflict Action Window');

                this.noMoreActions();
                this.player1.pass();
                this.scholar.bowed = false;
                this.vengeful.bowed = false;

                this.player2.pass();
                this.player2.passConflict();
                this.noMoreActions();

                this.initiateConflict({
                    type: 'military',
                    attackers: [this.scholar],
                    defenders: [this.challenger],
                    province: this.p3,
                    ring: 'fire'
                });

                this.player2.clickCard(this.vengeful);
                expect(this.player2).toBeAbleToSelectRing('void');
                this.player2.clickRing('void');
                this.player2.clickCard(this.scholar);
                expect(this.getChatLogs(5)).toContain('player2 uses Vengeful Kami to resolve the Void Ring effect');
                expect(this.getChatLogs(5)).toContain('player2 resolves the void ring, removing a fate from Solemn Scholar');
            });
        });

        describe('Ebb and Flow', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['adept-of-the-waves', 'solemn-scholar'],
                        hand: ['ebb-and-flow', 'studious']
                    },
                    player2: {
                        inPlay: ['student-of-the-method', 'bayushi-aramoro'],
                        hand: ['assassination', 'let-go', 'duelist-training']
                    }
                });

                this.scholar = this.player1.findCardByName('solemn-scholar');
                this.studious = this.player1.findCardByName('studious');
                this.adept = this.player1.findCardByName('adept-of-the-waves');
                this.student = this.player2.findCardByName('student-of-the-method');
                this.aramoro = this.player2.findCardByName('bayushi-aramoro');
                this.training = this.player2.findCardByName('duelist-training');
                this.ebb = this.player1.findCardByName('ebb-and-flow');

                this.player1.playAttachment(this.studious, this.scholar);
                this.player2.playAttachment(this.training, this.aramoro);
            });

            it('should work', function () {
                const fate = this.player1.fate;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adept],
                    defenders: [this.student, this.aramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.ebb);
                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.aramoro);

                expect(this.getChatLogs(5)).toContain('player1 plays Ebb and Flow to switch Bayushi Aramoro\'s military and political skill');

                expect(this.aramoro.getMilitarySkill()).toBe(2);
                expect(this.aramoro.getPoliticalSkill()).toBe(5);
                expect(this.player1).toHavePrompt('Pay 1 fate to swap abilities?');
                expect(this.player1).toHavePromptButton('Yes');
                expect(this.player1).toHavePromptButton('No');

                this.player1.clickPrompt('Yes');

                expect(this.player1.fate).toBe(fate - 1);
                expect(this.getChatLogs(5)).toContain('player1 channels their water affinity to swap the abilities of Adept of the Waves and Bayushi Aramoro');

                this.player2.clickCard(this.aramoro);
                expect(this.player2).toHavePrompt('Choose an ability:');
                expect(this.player2).toHavePromptButton('Grant Covert to a character');
                expect(this.player2).toHavePromptButton('Initiate a duel to bow');

                this.player2.clickPrompt('Grant Covert to a character');
                this.player2.clickCard(this.aramoro);
                expect(this.getChatLogs(5)).toContain('player2 uses Bayushi Aramoro\'s gained ability from Adept of the Waves to grant Covert during water conflicts to Bayushi Aramoro');

                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.aramoro);

                expect(this.getChatLogs(5)).toContain('player1 uses Adept of the Waves\'s gained ability from Bayushi Aramoro, dishonoring Adept of the Waves to reduce Bayushi Aramoro\'s military skill by 2 - they will die if they reach 0');
            });

            it('shouldnt be able to swap if you dont have fate', function () {
                this.player1.fate = 0;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adept],
                    defenders: [this.student, this.aramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.ebb);
                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.aramoro);

                expect(this.getChatLogs(5)).toContain('player1 plays Ebb and Flow to switch Bayushi Aramoro\'s military and political skill');

                expect(this.aramoro.getMilitarySkill()).toBe(2);
                expect(this.aramoro.getPoliticalSkill()).toBe(5);
                expect(this.player1).not.toHavePrompt('Pay 1 fate to swap abilities?');
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('passives', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adept],
                    defenders: [this.student, this.aramoro]
                });

                expect(this.student.getMilitarySkill()).toBe(3);
                expect(this.student.getPoliticalSkill()).toBe(3);

                this.player2.pass();
                this.player1.clickCard(this.ebb);
                this.player1.clickCard(this.adept);
                this.player1.clickCard(this.student);
                this.player1.clickPrompt('Yes');

                expect(this.student.getMilitarySkill()).toBe(1);
                expect(this.student.getPoliticalSkill()).toBe(1);

                expect(this.adept.getMilitarySkill()).toBe(4);
                expect(this.adept.getPoliticalSkill()).toBe(4);

                expect(this.getChatLogs(5)).toContain('player1 channels their water affinity to swap the abilities of Adept of the Waves and Student of the Method');
                expect(this.adept.hasKeyword('sincerity')).toBe(true);
            });

            it('ganied keywords', function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.adept, this.scholar],
                    defenders: [this.student, this.aramoro]
                });

                this.player2.pass();
                this.player1.clickCard(this.ebb);
                this.player1.clickCard(this.scholar);
                this.player1.clickCard(this.aramoro);
                this.player1.clickPrompt('Yes');
                expect(this.scholar.hasKeyword('sincerity')).toBe(true);
                expect(this.aramoro.hasKeyword('sincerity')).toBe(false);
            });
        });
    });
});
