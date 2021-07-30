describe('Henshin Seeker', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['henshin-seeker', 'ancient-master'],
                    hand: ['void-fist', 'against-the-waves'],
                    conflictDiscard: ['fine-katana', 'hurricane-punch', 'centipede-tattoo', 'against-the-waves', 'censure', 'ornate-fan', 'ki-alignment', 'hurricane-punch', 'void-fist']
                },
                player2: {
                    inPlay: ['tattooed-wanderer']
                }
            });
            this.seeker = this.player1.findCardByName('henshin-seeker');
            this.ancientMaster = this.player1.findCardByName('ancient-master');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.voidFist = this.player1.findCardByName('void-fist', 'conflict discard pile');
            this.voidFistH = this.player1.findCardByName('void-fist', 'hand');

            this.atw = this.player1.findCardByName('against-the-waves', 'conflict discard pile');
            this.atwH = this.player1.findCardByName('against-the-waves', 'hand');
            this.HP1 = this.player1.filterCardsByName('hurricane-punch')[0];
            this.HP2 = this.player1.filterCardsByName('hurricane-punch')[1];

            this.player1.reduceDeckToNumber('conflict deck', 0);
            this.player1.player.conflictDiscardPile.each(a => this.player1.moveCard(a, 'conflict deck'));
            this.noMoreActions();
        });

        it('should whiff if there is nothing in your discard', function() {
            this.initiateConflict({
                attackers: [this.seeker],
                defenders: [],
                ring: 'void'
            });
            this.player2.pass();
            this.player1.clickCard(this.seeker);
            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHaveDisabledPromptButton('Void Fist');
            expect(this.player1).toHaveDisabledPromptButton('Hurricane Punch (2)');
            expect(this.player1).toHaveDisabledPromptButton('Ki Alignment');
            expect(this.player1).toHaveDisabledPromptButton('Against the Waves');
            expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            expect(this.player1).toHaveDisabledPromptButton('Centipede Tattoo');
            expect(this.player1).toHavePromptButton('Take nothing');
        });

        it('should let you pick a card in your discard and put it in your hand', function() {
            this.player1.moveCard(this.atwH, 'conflict discard pile');
            this.player1.moveCard(this.voidFistH, 'conflict discard pile');
            this.initiateConflict({
                attackers: [this.seeker],
                defenders: [],
                ring: 'void'
            });
            this.player2.pass();
            this.player1.clickCard(this.seeker);
            expect(this.player1).toHavePrompt('Select a card to reveal');
            expect(this.player1).toHavePromptButton('Void Fist');
            expect(this.player1).toHaveDisabledPromptButton('Hurricane Punch (2)');
            expect(this.player1).toHaveDisabledPromptButton('Ki Alignment');
            expect(this.player1).toHavePromptButton('Against the Waves');
            expect(this.player1).toHaveDisabledPromptButton('Ornate Fan');
            expect(this.player1).toHaveDisabledPromptButton('Censure');
            expect(this.player1).toHaveDisabledPromptButton('Centipede Tattoo');
            expect(this.player1).toHavePromptButton('Take nothing');
            this.player1.clickPrompt('Void Fist');

            expect(this.voidFist.location).toBe('hand');

            expect(this.getChatLogs(5)).toContain('player1 uses Henshin Seeker to look at the top eight cards of their deck for a kiho or spell');
            expect(this.getChatLogs(5)).toContain('player1 takes Void Fist');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their conflict deck');
        });

        it('should not trigger in a non void conflict', function() {
            this.initiateConflict({
                attackers: [this.seeker],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
            this.player1.clickCard(this.seeker);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should trigger if you have the void ring claimed', function() {
            this.player1.claimRing('void');
            this.initiateConflict({
                attackers: [this.seeker],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
            this.player1.clickCard(this.seeker);
            expect(this.player1).toHavePrompt('Select a card to reveal');
        });

        it('should not trigger if opponent has void ring claimed', function() {
            this.player2.claimRing('void');
            this.initiateConflict({
                attackers: [this.seeker],
                defenders: [],
                ring: 'air'
            });
            this.player2.pass();
            this.player1.clickCard(this.seeker);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
