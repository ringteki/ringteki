describe('Field Barracks', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['doji-challenger', 'doji-whisperer', 'brash-samurai'],
                    dynastyDiscard: ['field-barracks', 'staging-ground', 'a-season-of-war', 'favorable-ground', 'master-tactician']
                },
                player2: {
                    inPlay: ['yogo-hiroue', 'matsu-berserker'],
                    hand: ['calling-in-favors']
                }
            });

            this.challenger = this.player1.findCardByName('doji-challenger');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.hiroue = this.player2.findCardByName('yogo-hiroue');
            this.berserker = this.player2.findCardByName('matsu-berserker');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.fg = this.player1.findCardByName('favorable-ground');
            this.tactician = this.player1.findCardByName('master-tactician');

            this.p1 = this.player1.findCardByName('shameful-display', 'province 1');

            this.barracks = this.player1.findCardByName('field-barracks', 'dynasty discard pile');
            this.stagingGround = this.player1.findCardByName('staging-ground');
            this.sow = this.player1.findCardByName('a-season-of-war');
            this.cif = this.player2.findCardByName('calling-in-favors');

            this.player1.placeCardInProvince(this.barracks, 'province 1');
            this.player1.placeCardInProvince(this.stagingGround, 'province 2');
            this.player1.placeCardInProvince(this.sow, 'province 3');
            this.barracks.facedown = true;
        });

        it('should trigger when revealed and attach to a province', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');
        });

        it('should not work when not revealed - put into play with sow', function() {
            this.player1.moveCard(this.barracks, 'dynasty deck');
            this.player1.reduceDeckToNumber('dynasty deck', 4);
            this.player1.clickCard(this.sow);
            expect(this.barracks.location).not.toBe('dynasty deck');
            expect(this.barracks.location).toBe('province 1');

            expect(this.player1).not.toHavePrompt('triggered abilities');
            expect(this.player1).not.toBeAbleToSelect(this.barracks);
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('should let you pick between playing and discarding', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');

            this.player1.moveCard(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(this.brash);
            expect(this.player1).toHavePromptButton('Play this card');
            expect(this.player1).toHavePromptButton('Discard and refill faceup');
            expect(this.getChatLogs(10)).toContain('player1 uses Field Barracks to play or discard Brash Samurai');
        });

        it('should discard and refill', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');

            this.player1.placeCardInProvince(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(this.brash);
            expect(this.player1).toHavePromptButton('Play this card');
            expect(this.player1).toHavePromptButton('Discard and refill faceup');

            this.player1.clickPrompt('Discard and refill faceup');
            expect(this.brash.location).toBe('dynasty discard pile');
            let newCard = this.player1.player.getDynastyCardInProvince('province 1');
            expect(newCard.facedown).toBe(false);
        });

        it('should let you play the character (dynasty)', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');

            this.player1.moveCard(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(this.brash);
            expect(this.player1).toHavePromptButton('Play this card');
            expect(this.player1).toHavePromptButton('Discard and refill faceup');

            let fate = this.player1.fate;
            this.player1.clickPrompt('Play this card');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            this.player1.clickPrompt('1');
            expect(this.brash.location).toBe('play area');
            expect(this.brash.fate).toBe(1);
            expect(this.player1.fate).toBe(fate - 3);
            expect(this.getChatLogs(10)).toContain('player1 chooses to play Brash Samurai');
            expect(this.getChatLogs(10)).toContain('player1 plays Brash Samurai with 1 additional fate');
        });

        it('should not let you play a holding', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');

            this.player1.moveCard(this.fg, 'province 1');
            this.fg.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            expect(this.player1).toBeAbleToSelect(this.fg);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(this.fg);
            expect(this.player1).not.toHavePromptButton('Play this card');
            expect(this.player1).toHavePromptButton('Discard and refill faceup');
        });

        it('should let you trigger twice if you have a commander', function() {
            this.player1.moveCard(this.tactician, 'play area');
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.barracks);

            this.player1.placeCardInProvince(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            this.player1.clickCard(this.brash);
            this.player1.clickPrompt('Discard and refill faceup');
            let newCard = this.player1.player.getDynastyCardInProvince('province 1');
            expect(this.player1).toHavePromptButton('Resolve this ability again');
            expect(this.player1).toHavePromptButton('Done');

            this.player1.clickPrompt('Resolve this ability again');
            expect(this.player1).toBeAbleToSelect(newCard);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(newCard);
            this.player1.clickPrompt('Discard and refill faceup');
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('should let you trigger twice if you have a commander (skip trigger)', function() {
            this.player1.moveCard(this.tactician, 'play area');
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.barracks);

            this.player1.placeCardInProvince(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.clickCard(this.barracks);
            this.player1.clickCard(this.brash);
            this.player1.clickPrompt('Discard and refill faceup');
            this.player1.clickPrompt('Done');
            expect(this.player1).toHavePrompt('Play cards from provinces');
        });

        it('should let you play the character (not dynasty)', function() {
            expect(this.barracks.facedown).toBe(true);
            this.player1.clickCard(this.stagingGround);
            this.player1.clickCard(this.barracks);
            this.player1.clickPrompt('Done');
            expect(this.barracks.facedown).toBe(false);
            expect(this.player1).toHavePrompt('triggered abilities');
            expect(this.player1).toBeAbleToSelect(this.barracks);
            this.player1.clickCard(this.barracks);

            expect(this.p1.attachments.size()).toBe(1);
            expect(this.barracks.getType()).toBe('attachment');

            this.player1.moveCard(this.brash, 'province 1');
            this.brash.facedown = false;

            this.player2.pass();
            this.player1.pass();

            this.player1.clickPrompt('1'); //bid
            this.player2.clickPrompt('1'); //bid

            this.player1.clickCard(this.barracks);
            expect(this.player1).toBeAbleToSelect(this.brash);
            expect(this.player1).not.toBeAbleToSelect(this.stagingGround);

            this.player1.clickCard(this.brash);
            expect(this.player1).toHavePromptButton('Play this card');
            expect(this.player1).toHavePromptButton('Discard and refill faceup');

            let fate = this.player1.fate;
            this.player1.clickPrompt('Play this card');
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).toHavePromptButton('1');
            this.player1.clickPrompt('1');
            expect(this.brash.location).toBe('play area');
            expect(this.brash.fate).toBe(1);
            expect(this.player1.fate).toBe(fate - 3);
            expect(this.getChatLogs(10)).toContain('player1 chooses to play Brash Samurai');
            expect(this.getChatLogs(10)).toContain('player1 plays Brash Samurai with 1 additional fate');
        });
    });
});
