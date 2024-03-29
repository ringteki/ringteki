describe('Hawk Tattoo', function () {
    integration(function () {
        describe('Hawk Tattoo\'s ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['tattooed-wanderer', 'agasha-swordsmith', 'ancient-master'],
                        hand: ['hawk-tattoo']
                    },
                    player2: {
                        inPlay: ['seppun-guardsman', 'adept-of-the-waves']
                    }
                });
                this.tattooedWanderer = this.player1.findCardByName('tattooed-wanderer');
                this.agashaSwordsmith = this.player1.findCardByName('agasha-swordsmith');
                this.adeptOfTheWaves = this.player2.findCardByName('adept-of-the-waves');
                this.seppunGuardsman = this.player2.findCardByName('seppun-guardsman');
                this.noMoreActions();
                this.initiateConflict({
                    attackers: ['ancient-master', 'agasha-swordsmith'],
                    defenders: ['seppun-guardsman']
                });
                this.player2.pass();
            });

            it('should move a friendly character to the conflict', function () {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', this.tattooedWanderer);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
                this.player1.clickCard(this.hawkTattoo);
                expect(this.tattooedWanderer.inConflict).toBe(true);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(10)).toContain(
                    'player1 uses Hawk Tattoo to move Tattooed Wanderer into the conflict and take an additional action'
                );
            });

            it('should not be playable on an opposing character', function () {
                this.hawkTattoo = this.player1.clickCard('hawk-tattoo', 'hand');
                expect(this.player1).toBeAbleToSelect(this.tattooedWanderer);
                expect(this.player1).not.toBeAbleToSelect(this.seppunGuardsman);
            });

            it('should not pass priority if played on a monk in the conflict', function () {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', 'ancient-master');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.hawkTattoo);
                this.player1.clickCard(this.hawkTattoo);
                expect(this.player1).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(10)).toContain(
                    'player1 uses Hawk Tattoo to move Ancient Master into the conflict and take an additional action'
                );
            });

            it('should not trigger if played on a character in the conflict who is not a monk', function () {
                this.hawkTattoo = this.player1.playAttachment('hawk-tattoo', this.agashaSwordsmith);
                expect(this.agashaSwordsmith.attachments).toContain(this.hawkTattoo);
                expect(this.hawkTattoo.location).toBe('play area');
                expect(this.agashaSwordsmith.hasTrait('tattooed')).toBe(true);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
