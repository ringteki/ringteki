describe('Isawa Hifumi', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['isawa-hifumi', 'adept-of-the-waves'],
                    hand: ['soshi-s-memory', 'fine-katana', 'ornate-fan', 'let-go'],
                    conflictDiscard: ['hiruma-skirmisher', 'against-the-waves']
                }
            });

            this.isawaHifumi = this.player1.findCardByName('isawa-hifumi');
            this.isawaHifumi.fate = 2;
            this.adeptOfTheWaves = this.player1.findCardByName('adept-of-the-waves');
            this.adeptOfTheWaves.fate = 1;
            this.adeptOfTheWaves.bow();

            this.letGo = this.player1.findCardByName('let-go');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.skirmisher = this.player1.findCardByName('hiruma-skirmisher');
            this.soshisMemory = this.player1.findCardByName('soshi-s-memory');
            this.ornateFan = this.player1.findCardByName('soshi-s-memory');
            this.againstTheWaves = this.player1.findCardByName('against-the-waves');

            this.player1.playAttachment(this.fineKatana, this.isawaHifumi);
            this.player2.pass();
            this.player1.playAttachment(this.ornateFan, this.isawaHifumi);
        });

        it('replays an event for free the first time', function () {
            this.player1.clickCard(this.soshisMemory);
            this.player1.clickPrompt('player1');
            this.player1.clickPrompt('Supernatural Storm (2)');

            this.player2.pass();
            this.player1.clickCard(this.isawaHifumi);
            expect(this.player1).toHavePrompt('Choose an event');

            this.player1.clickCard(this.soshisMemory);
            this.player1.clickPrompt('player1');
            this.player1.clickPrompt('Supernatural Storm (2)');

            expect(this.isawaHifumi.fate).toBe(2);
            expect(this.soshisMemory.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 uses Isawa Hifumi to uow');
            expect(this.getChatLogs(6)).toContain("player1 plays Soshi's Memory from their conflict discard pile");
            expect(this.getChatLogs(6)).toContain("Soshi's Memory is removed from the game by Isawa Hifumi's ability");
        });

        xit('pays increasing fate costs for following triggers', function () {
            this.player1.clickCard(this.soshisMemory);
            this.player1.clickPrompt('player1');
            this.player1.clickPrompt('Supernatural Storm (2)');
            expect(this.soshisMemory.location).toBe('conflict discard pile');

            /**
             * FIRST HIFUMI
             */
            this.player2.pass();
            this.player1.clickCard(this.isawaHifumi);
            expect(this.player1).toHavePrompt('Choose an event');
            this.player1.clickCard(this.soshisMemory);
            this.player1.clickPrompt('player1');
            this.player1.clickPrompt('Supernatural Storm (2)');

            expect(this.isawaHifumi.fate).toBe(2);
            expect(this.soshisMemory.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 uses Isawa Hifumi to play an event from their discard pile');
            expect(this.getChatLogs(6)).toContain("player1 plays Soshi's Memory from their conflict discard pile");
            expect(this.getChatLogs(6)).toContain("Soshi's Memory is removed from the game by Isawa Hifumi's ability");

            /**
             * SECOND HIFUMI
             */
            this.player2.pass();
            this.player1.clickCard(this.isawaHifumi);
            expect(this.player1).toHavePrompt('Choose an event');
            this.player1.clickCard(this.againstTheWaves);

            expect(this.player1).toHavePrompt('Choose a character');
            this.player1.clickCard(this.adeptOfTheWaves);

            expect(this.isawaHifumi.fate).toBe(2);
            expect(this.againstTheWaves.location).toBe('removed from game');
            expect(this.getChatLogs(6)).toContain('player1 uses Isawa Hifumi to play an event from their discard pile');
            expect(this.getChatLogs(6)).toContain('player1 plays Against the Waves from their conflict discard pile');
            expect(this.getChatLogs(6)).toContain(
                "Against the Waves is removed from the game by Isawa Hifumi's ability"
            );
        });
    });
});