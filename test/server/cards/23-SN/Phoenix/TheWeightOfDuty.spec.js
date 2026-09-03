describe('The Weight of Duty', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['solemn-scholar', 'doji-challenger'],
                    hand: ['the-weight-of-duty', 'way-of-the-scorpion', 'voice-of-honor']
                },
                player2: {
                    inPlay: ['miya-mystic', 'doji-kuwanan'],
                    hand: ['way-of-the-scorpion', 'way-of-the-scorpion']
                }
            });
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.dojiChallenger = this.player1.findCardByName('doji-challenger');
            this.duty = this.player1.findCardByName('the-weight-of-duty');
            this.p1wayOfTheScorpion = this.player1.findCardByName('way-of-the-scorpion');
            this.voice = this.player1.findCardByName('voice-of-honor');

            this.mystic = this.player2.findCardByName('miya-mystic');
            this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
            this.wayOfTheScorpion = this.player2.filterCardsByName('way-of-the-scorpion')[0];
            this.wayOfTheScorpion2 = this.player2.filterCardsByName('way-of-the-scorpion')[1];

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scholar, this.dojiChallenger],
                defenders: [this.mystic, this.dojiKuwanan]
            });
        });

        it('should react when a shugenja character you control is targetted by an event', function () {
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
        });

        it('should not react when a non-shugenja character you control is targetted by an event', function () {
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.dojiChallenger);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not react when you target a shugenja character you control', function () {
            this.player2.pass();
            this.player1.clickCard(this.p1wayOfTheScorpion);
            this.player1.clickCard(this.scholar);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should react when a shugenja character you control is targetted by a non-event', function () {
            this.player2.clickCard(this.dojiKuwanan);
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
        });

        it('should not react when a shugenja character you don\'t control is targetted by an event', function () {
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.mystic);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should let you choose a bushi to honor and give pride to', function () {
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
            this.player1.clickCard(this.duty);
            expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
            expect(this.player1).not.toBeAbleToSelect(this.scholar);
            expect(this.player1).not.toBeAbleToSelect(this.dojiKuwanan);
            this.player1.clickCard(this.dojiChallenger);
            expect(this.dojiChallenger.isHonored).toBe(true);
            expect(this.dojiChallenger.hasKeyword('pride')).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should react even if the event is cancelled', function () {
            this.scholar.honor();
            this.player2.clickCard(this.wayOfTheScorpion);
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.voice);
            expect(this.player1).not.toBeAbleToSelect(this.duty);
            this.player1.clickCard(this.voice);
            expect(this.voice.location).toBe('conflict discard pile');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
            this.player1.clickCard(this.duty);
            expect(this.player1).toBeAbleToSelect(this.dojiChallenger);
        });
    });
});

describe('The Weight of Duty - sub-resolutions', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['solemn-scholar', 'doji-challenger'],
                    hand: ['the-weight-of-duty']
                },
                player2: {
                    inPlay: ['miya-mystic', 'doji-kuwanan'],
                    hand: ['nature-s-wrath', 'banzai']
                }
            });
            this.scholar = this.player1.findCardByName('solemn-scholar');
            this.dojiChallenger = this.player1.findCardByName('doji-challenger');
            this.duty = this.player1.findCardByName('the-weight-of-duty');

            this.mystic = this.player2.findCardByName('miya-mystic');
            this.dojiKuwanan = this.player2.findCardByName('doji-kuwanan');
            this.wrath = this.player2.findCardByName('nature-s-wrath');
            this.banzai = this.player2.findCardByName('banzai');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.scholar, this.dojiChallenger],
                defenders: [this.mystic, this.dojiKuwanan]
            });
        });

        it('should react when a shugenja you control is chosen only by the second resolution of Nature\'s Wrath', function () {
            this.player2.clickCard(this.wrath);
            expect(this.player2).toHavePrompt('Choose a character');
            this.player2.clickCard(this.dojiChallenger);
            expect(this.player1).toHavePrompt('Select one');
            this.player1.clickPrompt('Move this character home');

            expect(this.player2).toHavePromptButton('Dishonor a participating character to resolve this ability again');
            this.player2.clickPrompt('Dishonor a participating character to resolve this ability again');
            this.player2.clickCard(this.dojiKuwanan);

            expect(this.player2).toHavePrompt('Choose a character');
            this.player2.clickCard(this.scholar);
            expect(this.player1).toHavePrompt('Select one');
            this.player1.clickPrompt('Dishonor this character');

            expect(this.player2).toHavePromptButton('Done');
            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
            this.player1.clickCard(this.duty);
            this.player1.clickCard(this.dojiChallenger);
            expect(this.dojiChallenger.isHonored).toBe(true);
            expect(this.dojiChallenger.hasKeyword('pride')).toBe(true);
        });

        it('should still react to the second resolution of Banzai after the hardcoded workaround was removed', function () {
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.dojiKuwanan);
            this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
            this.player2.clickCard(this.scholar);
            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.duty);
            this.player1.clickCard(this.duty);
            this.player1.clickCard(this.dojiChallenger);
            expect(this.dojiChallenger.isHonored).toBe(true);
            expect(this.dojiChallenger.hasKeyword('pride')).toBe(true);
        });

        it('should only trigger once when both resolutions of Banzai target the same shugenja', function () {
            this.player2.clickCard(this.banzai);
            this.player2.clickCard(this.scholar);
            this.player2.clickPrompt('Lose 1 honor to resolve this ability again');
            this.player2.clickCard(this.scholar);
            this.player2.clickPrompt('Done');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            this.player1.clickCard(this.duty);
            this.player1.clickCard(this.dojiChallenger);
            expect(this.dojiChallenger.isHonored).toBe(true);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            expect(this.duty.location).toBe('conflict discard pile');
        });
    });
});
