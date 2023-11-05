describe('Composite Yumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['wandering-ronin', 'eager-scout'],
                    dynastyDeck: ['favorable-ground'],
                    hand: ['composite-yumi', 'steward-of-law']
                },
                player2: {
                    inPlay: ['shinjo-outrider'],
                    hand: ['stoic-gunso']
                }
            });
            this.fg = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.wanderingRonin = this.player1.findCardByName('wandering-ronin');
            this.scout = this.player1.findCardByName('eager-scout');
            this.stewardOfLaw = this.player1.findCardByName('steward-of-law');
            this.compositeYumi = this.player1.findCardByName('composite-yumi');

            this.shinjoOutrider = this.player2.findCardByName('shinjo-outrider');
            this.stoicGunso = this.player2.findCardByName('stoic-gunso');

            this.player1.playAttachment(this.compositeYumi, this.wanderingRonin);

            this.noMoreActions();
        });

        it('should trigger when a friendly character moves to the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when a friendly character moves home', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin, this.scout],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when an opposing character moves to the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.shinjoOutrider);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when it moves itself to the conflict', function () {
            this.initiateConflict({
                attackers: [this.scout],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.wanderingRonin);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when a friendly character is played into the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.pass();
            this.player1.clickCard(this.stewardOfLaw);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when an opposing character is played into the conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.compositeYumi);
        });

        it('should trigger when a character is played at home during a conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Home');
            expect(this.player1).toHavePrompt('Triggered Abilities');
        });

        it('should trigger if he is not participating in the conflict', function () {
            this.initiateConflict({
                attackers: [this.scout],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Home');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.pass();
            this.player2.clickCard(this.shinjoOutrider);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
        });

        it('should give him +1 military', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 1);
            expect(this.getChatLogs(5)).toContain('player1 uses Composite Yumi to give +1military to Wandering Ronin');
        });

        it('should trigger multiple times in a conflict', function () {
            this.initiateConflict({
                attackers: [this.wanderingRonin],
                defenders: []
            });
            this.player2.clickCard(this.stoicGunso);
            this.player2.clickPrompt('0');
            this.player2.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 1);
            this.player1.clickCard(this.fg);
            this.player1.clickCard(this.scout);
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 2);
            this.player2.clickCard(this.shinjoOutrider);
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 3);
            this.player1.clickCard(this.stewardOfLaw);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('Conflict');
            this.player1.clickCard(this.compositeYumi);
            expect(this.wanderingRonin.getMilitarySkill()).toBe(2 + 1 + 4);
        });
    });
});
