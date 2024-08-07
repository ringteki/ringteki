describe('Tribute to a New Dawn', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['matsu-berserker', 'ikoma-prodigy'],
                    hand: ['fine-katana', 'ornate-fan', 'compass', 'fan-of-command', 'guard-duty']
                },
                player2: {
                    inPlay: ['solemn-scholar'],
                    hand: ['cloud-the-mind', 'magnificent-kimono', 'sato', 'pacifism', 'tribute-to-a-new-dawn']
                }
            });

            this.matsuBerserker = this.player1.findCardByName('matsu-berserker');
            this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.ornateFan = this.player1.findCardByName('ornate-fan');
            this.compass = this.player1.findCardByName('compass');
            this.fanOfCommand = this.player1.findCardByName('fan-of-command');
            this.guardDuty = this.player1.findCardByName('guard-duty');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.cloudTheMind = this.player2.findCardByName('cloud-the-mind');
            this.magnificientKimono = this.player2.findCardByName('magnificent-kimono');
            this.sato = this.player2.findCardByName('sato');
            this.pacifism = this.player2.findCardByName('pacifism');
            this.tributeToANewDawn = this.player2.findCardByName('tribute-to-a-new-dawn');

            this.player1.playAttachment(this.fineKatana, this.matsuBerserker);
            this.player2.playAttachment(this.cloudTheMind, this.ikomaProdigy);
            this.player1.playAttachment(this.ornateFan, this.ikomaProdigy);
            this.player2.playAttachment(this.magnificientKimono, this.solemnScholar);
            this.player1.playAttachment(this.compass, this.matsuBerserker);
            this.player2.playAttachment(this.sato, this.ikomaProdigy);
            this.player1.playAttachment(this.fanOfCommand, this.matsuBerserker);
            this.player2.playAttachment(this.pacifism, this.matsuBerserker);
            this.player1.playAttachment(this.guardDuty, this.matsuBerserker);
        });

        it('discards multiple attachments', function () {
            this.player2.clickCard(this.tributeToANewDawn);
            expect(this.player1).toHavePrompt('Choose up to 3 attachments to keep');
            expect(this.player1).toBeAbleToSelect(this.fineKatana);
            expect(this.player1).toBeAbleToSelect(this.ornateFan);
            expect(this.player1).toBeAbleToSelect(this.compass);
            expect(this.player1).toBeAbleToSelect(this.fanOfCommand);
            expect(this.player1).toBeAbleToSelect(this.guardDuty);
            expect(this.player1).not.toBeAbleToSelect(this.matsuBerserker);
            expect(this.player1).not.toBeAbleToSelect(this.ikomaProdigy);
            expect(this.player1).not.toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.cloudTheMind);
            expect(this.player1).not.toBeAbleToSelect(this.magnificientKimono);
            expect(this.player1).not.toBeAbleToSelect(this.sato);
            expect(this.player1).not.toBeAbleToSelect(this.pacifism);

            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.ornateFan);
            this.player1.clickCard(this.compass);
            this.player1.clickPrompt('Done');

            expect(this.player2).toHavePrompt('Choose up to 3 attachments to keep');
            expect(this.player2).not.toBeAbleToSelect(this.fineKatana);
            expect(this.player2).not.toBeAbleToSelect(this.ornateFan);
            expect(this.player2).not.toBeAbleToSelect(this.compass);
            expect(this.player2).not.toBeAbleToSelect(this.fanOfCommand);
            expect(this.player2).not.toBeAbleToSelect(this.guardDuty);
            expect(this.player2).not.toBeAbleToSelect(this.matsuBerserker);
            expect(this.player2).not.toBeAbleToSelect(this.ikomaProdigy);
            expect(this.player2).not.toBeAbleToSelect(this.solemnScholar);
            expect(this.player2).toBeAbleToSelect(this.cloudTheMind);
            expect(this.player2).toBeAbleToSelect(this.magnificientKimono);
            expect(this.player2).toBeAbleToSelect(this.sato);
            expect(this.player2).toBeAbleToSelect(this.pacifism);

            this.player2.clickCard(this.cloudTheMind);
            this.player2.clickCard(this.sato);
            this.player2.clickCard(this.pacifism);
            this.player2.clickPrompt('Done');

            expect(this.fanOfCommand.location).toBe('conflict discard pile');
            expect(this.guardDuty.location).toBe('conflict discard pile');
            expect(this.magnificientKimono.location).toBe('conflict discard pile');
            expect(this.fineKatana.location).toBe('play area');
            expect(this.ornateFan.location).toBe('play area');
            expect(this.compass.location).toBe('play area');
            expect(this.cloudTheMind.location).toBe('play area');
            expect(this.sato.location).toBe('play area');
            expect(this.pacifism.location).toBe('play area');

            expect(this.getChatLogs(3)).toContain(
                'player2 plays Tribute to a New Dawn to discard Fan of Command, Guard Duty and Magnificent Kimono'
            );
        });
    });
});