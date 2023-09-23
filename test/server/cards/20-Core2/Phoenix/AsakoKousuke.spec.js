describe('Asako Kousuke', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'asako-kousuke',
                        'adept-of-the-waves',
                        'solemn-scholar',
                        'keeper-initiate',
                        'seeker-initiate'
                    ]
                },
                player2: {
                    inPlay: ['bayushi-manipulator']
                }
            });
            this.kousukeHonorable = this.player1.findCardByName('asako-kousuke');
            this.adeptHonorable = this.player1.findCardByName('adept-of-the-waves');
            this.solemnDishonorable = this.player1.findCardByName('solemn-scholar');
            this.keeperTainted = this.player1.findCardByName('keeper-initiate');
            this.seekerOrdinary = this.player1.findCardByName('seeker-initiate');

            this.manipulatorDishonorable = this.player2.findCardByName('bayushi-manipulator');

            this.kousukeHonorable.honor();
            this.adeptHonorable.honor();
            this.solemnDishonorable.dishonor();
            this.keeperTainted.taint();
            this.manipulatorDishonorable.dishonor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.adeptHonorable, this.solemnDishonorable, this.keeperTainted, this.seekerOrdinary],
                defenders: [this.manipulatorDishonorable]
            });
            this.player2.pass();
        });

        it('chooses participating characters with stats', function () {
            this.player1.clickCard(this.kousukeHonorable);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toBeAbleToSelect(this.kousukeHonorable);
            expect(this.player1).not.toBeAbleToSelect(this.seekerOrdinary);
            expect(this.player1).toBeAbleToSelect(this.adeptHonorable);
            expect(this.player1).toBeAbleToSelect(this.solemnDishonorable);
            expect(this.player1).toBeAbleToSelect(this.keeperTainted);
            expect(this.player1).toBeAbleToSelect(this.manipulatorDishonorable);
        });

        it('can honor or taint the dishonorable', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.solemnDishonorable);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Turn it into Honorable');
            expect(this.player1).not.toHavePromptButton('Turn it into Dishonorable');
            expect(this.player1).toHavePromptButton('Turn it into Tainted');
        });

        it('can honor or dishonor the tainted', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.keeperTainted);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).toHavePromptButton('Turn it into Honorable');
            expect(this.player1).toHavePromptButton('Turn it into Dishonorable');
            expect(this.player1).not.toHavePromptButton('Turn it into Tainted');
        });

        it('can dishonor or taint the honorable', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.adeptHonorable);
            expect(this.player1).toHavePrompt('Select one');
            expect(this.player1).not.toHavePromptButton('Turn it into Honorable');
            expect(this.player1).toHavePromptButton('Turn it into Dishonorable');
            expect(this.player1).toHavePromptButton('Turn it into Tainted');
        });

        it('changes status to honorable', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.solemnDishonorable);
            this.player1.clickPrompt('Turn it into Honorable');
            expect(this.solemnDishonorable.isDishonored).toBe(false);
            expect(this.solemnDishonorable.isHonored).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                "Asako Kousuke's wisdom and wit clarifies what it means to be honored. For this conflict, Solemn Scholar is treated as honored"
            );
        });
        it('changes status to dishonorable', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.adeptHonorable);
            this.player1.clickPrompt('Turn it into Dishonorable');
            expect(this.adeptHonorable.isHonored).toBe(false);
            expect(this.adeptHonorable.isDishonored).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                "Asako Kousuke's wisdom and wit clarifies what it means to be dishonored. For this conflict, Adept of the Waves is treated as dishonored"
            );
        });
        it('changes status to tainted', function () {
            this.player1.clickCard(this.kousukeHonorable);
            this.player1.clickCard(this.adeptHonorable);
            this.player1.clickPrompt('Turn it into Tainted');
            expect(this.adeptHonorable.isHonored).toBe(false);
            expect(this.adeptHonorable.isTainted).toBe(true);
            expect(this.getChatLogs(5)).toContain(
                "Asako Kousuke's wisdom and wit clarifies what it means to be tainted. For this conflict, Adept of the Waves is treated as tainted"
            );
        });
    });
});
