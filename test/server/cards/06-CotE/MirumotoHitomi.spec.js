describe('Mirumoto Hitomi', function() {
    integration(function() {
        describe('Mirumoto Hitomi\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-hitomi'],
                        hand: ['way-of-the-scorpion']
                    },
                    player2: {
                        inPlay: ['mirumoto-raitsugu', 'doomed-shugenja', 'togashi-initiate']
                    }
                });
                this.mirumotoHitomi = this.player1.findCardByName('mirumoto-hitomi');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');

                this.mirumotoRaitsugu = this.player2.findCardByName('mirumoto-raitsugu');
                this.doomedShugenja = this.player2.findCardByName('doomed-shugenja');
                this.togashiInitiate = this.player2.findCardByName('togashi-initiate');
            });

            it('should not be able to be triggered outside of a conflict', function() {
                expect(this.player1).toHavePrompt('Action Window');
                this.player1.clickCard(this.mirumotoHitomi);
                expect(this.player1).toHavePrompt('Action Window');
            });

            it('should prompt to target up to 2 participating characters', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'political'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                expect(this.player1).not.toBeAbleToSelect(this.togashiInitiate);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                expect(this.player1).toHavePromptButton('Done');
                this.player1.clickCard(this.doomedShugenja);
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                expect(this.player1).toHavePromptButton('Done');
            });

            it('should calculate the result of the duel by combining the military skill of the targets', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                expect(this.player1).toHavePrompt('Mirumoto Hitomi');
                expect(this.player1).toBeAbleToSelect(this.mirumotoRaitsugu);
                expect(this.player1).toBeAbleToSelect(this.doomedShugenja);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');

                expect(this.mirumotoHitomi.getMilitarySkill()).toBe(4);
                expect(this.mirumotoRaitsugu.getMilitarySkill()).toBe(3);
                expect(this.doomedShugenja.getMilitarySkill()).toBe(3);

                expect(this.getChatLogs(2)).toContain('Mirumoto Hitomi: 9 vs 7: Mirumoto Raitsugu and Doomed Shugenja');
            });

            it('should prompt the controller of the losers to choose to dishonor or bow (duel target)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Dishonor this character');
                expect(this.mirumotoRaitsugu.isDishonored).toBe(false); //should not be dishonored yet until all choices are made

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Bow this character');

                expect(this.mirumotoRaitsugu.isDishonored).toBe(true);
                expect(this.doomedShugenja.bowed).toBe(true);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt the controller of the losers to choose to dishonor or bow (Hitomi)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');

                expect(this.player1).toHavePrompt('Select an action:');
                expect(this.player1).toHavePromptButton('Dishonor this character');
                expect(this.player1).toHavePromptButton('Bow this character');

                this.player1.clickPrompt('Dishonor this character');
                expect(this.mirumotoHitomi.isDishonored).toBe(true);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should only prompt with valid options', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi],
                    defenders: [this.mirumotoRaitsugu, this.doomedShugenja],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.wayOfTheScorpion);
                this.player1.clickCard(this.mirumotoRaitsugu);
                expect(this.mirumotoRaitsugu.isDishonored).toBe(true);

                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.mirumotoRaitsugu);
                this.player1.clickCard(this.doomedShugenja);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('5');
                this.player2.clickPrompt('1');

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).not.toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Bow this character');

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Bow this character');

                expect(this.mirumotoRaitsugu.bowed).toBe(true);
                expect(this.doomedShugenja.bowed).toBe(true);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });

        describe('Mirumoto Hitomi\'s ability - Skirmish', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['mirumoto-hitomi', 'mirumoto-raitsugu'],
                        hand: ['way-of-the-scorpion']
                    },
                    player2: {
                        inPlay: ['isawa-tadaka-2', 'prodigy-of-the-waves', 'togashi-initiate'],
                        hand: ['fine-katana']
                    },
                    skirmish: true
                });
                this.mirumotoHitomi = this.player1.findCardByName('mirumoto-hitomi');
                this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');
                this.wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');

                this.katana = this.player2.findCardByName('fine-katana');
                this.tadaka = this.player2.findCardByName('isawa-tadaka-2');
                this.prodigy = this.player2.findCardByName('prodigy-of-the-waves');

                this.tadaka.honor();
                this.prodigy.honor();

                this.player1.pass();
                this.player2.playAttachment(this.katana, this.prodigy);

                this.tadaka.fate = 1;
                this.prodigy.fate = 1;
                this.mirumotoHitomi.fate = 1;
                this.raitsugu.fate = 1;
            });

            it('should prompt the controller of the losers to choose to dishonor or bow (duel target)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi, this.raitsugu],
                    defenders: [this.tadaka, this.prodigy],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.tadaka);
                this.player1.clickCard(this.prodigy);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('3');
                this.player2.clickPrompt('1');

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Dishonor this character');
                expect(this.tadaka.isHonored).toBe(true); //should not be dishonored yet until all choices are made

                expect(this.player2).toHavePrompt('Select an action:');
                expect(this.player2).toHavePromptButton('Dishonor this character');
                expect(this.player2).toHavePromptButton('Bow this character');

                this.player2.clickPrompt('Bow this character');

                expect(this.tadaka.isHonored).toBe(false);
                expect(this.prodigy.bowed).toBe(true);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should prompt the controller of the losers to choose to dishonor or bow (Hitomi)', function() {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.mirumotoHitomi, this.raitsugu],
                    defenders: [this.tadaka, this.prodigy],
                    type: 'military'
                });
                this.player2.pass();
                this.player1.clickCard(this.mirumotoHitomi);
                this.player1.clickCard(this.tadaka);
                this.player1.clickCard(this.prodigy);
                this.player1.clickPrompt('Done');
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('2');

                expect(this.player1).toHavePrompt('Select an action:');
                expect(this.player1).toHavePromptButton('Dishonor this character');
                expect(this.player1).toHavePromptButton('Bow this character');

                this.player1.clickPrompt('Dishonor this character');
                expect(this.mirumotoHitomi.isDishonored).toBe(true);

                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
