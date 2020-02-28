describe('Favorable Alliance', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['kakita-yoshi'],
                    hand: ['favorable-alliance'],
                    conflictDiscard: ['voice-of-honor', 'fine-katana', 'height-of-fashion', 'ornate-fan', 'way-of-the-crane', 'political-rival']
                },
                player2: {
                    inPlay: ['utaku-tetsuko'],
                    hand: ['mirumoto-s-fury'],
                    provinces: ['blood-of-onnotangu', 'manicured-garden']
                }
            });

            this.yoshi = this.player1.findCardByName('kakita-yoshi');
            this.alliance = this.player1.findCardByName('favorable-alliance');

            this.voice = this.player1.findCardByName('voice-of-honor');
            this.katana = this.player1.findCardByName('fine-katana');
            this.fashion = this.player1.findCardByName('height-of-fashion');
            this.fan = this.player1.findCardByName('ornate-fan');
            this.crane = this.player1.findCardByName('way-of-the-crane');
            this.rival = this.player1.findCardByName('political-rival');

            this.tetsuko = this.player2.findCardByName('utaku-tetsuko');
            this.fury = this.player2.findCardByName('mirumoto-s-fury');
            this.blood = this.player2.findCardByName('blood-of-onnotangu');
            this.garden = this.player2.findCardByName('manicured-garden');

            this.player1.reduceDeckToNumber('conflict deck', 0);

            this.player1.moveCard(this.rival, 'conflict deck');
            this.player1.moveCard(this.crane, 'conflict deck');
            this.player1.moveCard(this.fan, 'conflict deck');
            this.player1.moveCard(this.fashion, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');
            this.player1.moveCard(this.voice, 'conflict deck');
        });

        it('should draw cards equal to the fate spent', function() {
            this.player1.fate = 4;
            let fate = this.player1.fate;
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Choose a value for X');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            this.player1.clickPrompt('3');
            expect(this.voice.location).toBe('hand');
            expect(this.katana.location).toBe('hand');
            expect(this.fashion.location).toBe('hand');

            expect(this.player1.hand.length).toBe(3);
            expect(this.getChatLogs(10)).toContain('player1 plays Favorable Alliance to draw 3 cards');
            expect(this.player1.fate).toBe(fate - 3);
        });

        it('should work with Yoshi', function() {
            this.player1.fate = 2;
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [],
                type: 'military',
                province: this.garden
            });

            this.player2.pass();
            this.player1.clickCard(this.yoshi);
            expect(this.voice.location).toBe('hand');
            expect(this.katana.location).toBe('hand');
            expect(this.fashion.location).toBe('hand');

            this.player1.moveCard(this.fashion, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');
            this.player1.moveCard(this.voice, 'conflict deck');

            this.player2.pass();

            let fate = this.player1.fate;
            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Choose a value for X');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).toHavePromptButton('3');
            expect(this.player1).toHavePromptButton('4');
            this.player1.clickPrompt('3');
            expect(this.voice.location).toBe('hand');
            expect(this.katana.location).toBe('hand');
            expect(this.fashion.location).toBe('hand');

            expect(this.player1.hand.length).toBe(3);
            expect(this.getChatLogs(10)).toContain('player1 plays Favorable Alliance to draw 3 cards');
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should work with Blood of Onnotangu & Yoshi', function() {
            this.player1.fate = 6;
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.yoshi],
                defenders: [],
                type: 'military',
                province: this.blood
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Conflict Action Window');

            this.player1.clickCard(this.yoshi);
            expect(this.voice.location).toBe('hand');
            expect(this.katana.location).toBe('hand');
            expect(this.fashion.location).toBe('hand');

            this.player1.moveCard(this.fashion, 'conflict deck');
            this.player1.moveCard(this.katana, 'conflict deck');
            this.player1.moveCard(this.voice, 'conflict deck');

            this.player2.pass();

            let fate = this.player1.fate;
            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Choose a value for X');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('2');
            expect(this.voice.location).toBe('hand');
            expect(this.katana.location).toBe('hand');

            expect(this.player1.hand.length).toBe(2);
            expect(this.getChatLogs(10)).toContain('player1 plays Favorable Alliance to draw 2 cards');
            expect(this.player1.fate).toBe(fate);
        });

        it('should work with Tetsuko - able to afford to play the card', function() {
            this.player1.fate = 2;
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tetsuko],
                defenders: [],
                type: 'military'
            });

            let fate = this.player1.fate;
            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Choose a value for X');
            expect(this.player1).toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            expect(this.player1).not.toHavePromptButton('3');
            expect(this.player1).not.toHavePromptButton('4');
            this.player1.clickPrompt('1');
            expect(this.voice.location).toBe('hand');
            expect(this.player1.hand.length).toBe(1);
            expect(this.getChatLogs(10)).toContain('player1 plays Favorable Alliance to draw 1 cards');
            expect(this.player1.fate).toBe(fate - 2);
        });

        it('should work with Tetsuko - unable to afford to play the card', function() {
            this.player1.fate = 1;
            this.player1.player.imperialFavor = 'military';
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.tetsuko],
                defenders: [],
                type: 'military'
            });

            this.player1.clickCard(this.alliance);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
