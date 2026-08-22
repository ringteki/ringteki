describe('A Cleansing Death', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['mapmaker-apprentice', 'mapmaker-apprentice', 'doji-challenger'],
                    hand: ['invocation-of-ash', 'let-go', 'assassination']
                },
                player2: {
                    inPlay: ['togashi-mitsu', 'doji-whisperer'],
                    hand: ['assassination']
                }
            });

            this.map1 = this.player1.filterCardsByName('mapmaker-apprentice')[0];
            this.map2 = this.player1.filterCardsByName('mapmaker-apprentice')[1];
            this.challenger = this.player1.findCardByName('doji-challenger');

            this.letgo = this.player1.findCardByName('let-go');
            this.invocation = this.player1.findCardByName('invocation-of-ash');
            this.assassination1 = this.player1.findCardByName('assassination');

            this.mitsu = this.player2.findCardByName('togashi-mitsu');
            this.whisperer = this.player2.findCardByName('doji-whisperer');
            this.assassination2 = this.player2.findCardByName("assassination");

            this.sd1 = this.player2.findCardByName('shameful-display', 'province 1');
            this.sd2 = this.player2.findCardByName('shameful-display', 'province 2');
        });

        it('happy path', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Select an action:');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 2');
            expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 2');

            this.player1.clickPrompt('Lower attacked province\'s strength by 2');

            expect(this.sd1.getStrength()).toBe(strength - 2);

            expect(this.getChatLogs(5)).toContain('player1 chooses to reduce Shameful Display\'s strength by 2');
        });

        it('different province', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
                province: this.sd2
            });

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('opponent event', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
                province: this.sd1
            });

            this.player2.clickCard(this.assassination2);
            this.player2.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('happy path - increase', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Select an action:');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 2');
            expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 2');

            this.player1.clickPrompt('Raise attacked province\'s strength by 2');

            expect(this.sd1.getStrength()).toBe(strength + 2);

            expect(this.getChatLogs(5)).toContain('player1 chooses to increase Shameful Display\'s strength by 2');
        });

        it('second event should do nothing', function () {
            this.player1.playAttachment(this.invocation, this.challenger);
            this.player2.pass();

            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Raise attacked province\'s strength by 2');
            expect(this.sd1.getStrength()).toBe(strength + 2);

            this.player2.pass();
            this.player1.clickCard(this.letgo);
            this.player1.clickCard(this.invocation);

            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('killing apprentice should not stop effect', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.clickCard(this.assassination2);
            this.player2.clickCard(this.map1);

            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Raise attacked province\'s strength by 2');
            expect(this.sd1.getStrength()).toBe(strength + 2);
        });

        it('double up', function () {
            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            this.player2.pass();
            this.player1.clickCard(this.map2);
            this.player1.clickCard(this.sd1);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            expect(this.player1).toHavePrompt('Select an action:');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 2');
            expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 2');

            this.player1.clickPrompt('Raise attacked province\'s strength by 2');

            expect(this.sd1.getStrength()).toBe(strength + 2);

            expect(this.player1).toHavePrompt('Select an action:');
            expect(this.player1).toHavePromptButton('Lower attacked province\'s strength by 2');
            expect(this.player1).toHavePromptButton('Raise attacked province\'s strength by 2');

            this.player1.clickPrompt('Raise attacked province\'s strength by 2');

            expect(this.sd1.getStrength()).toBe(strength + 4);
        });

        it('second conflict', function () {
            this.player1.playAttachment(this.invocation, this.challenger);
            this.mitsu.honor();
            this.player2.pass();

            this.player1.clickCard(this.map1);
            this.player1.clickCard(this.sd1);
            expect(this.getChatLogs(5)).toContain('player1 uses Mapmaker Apprentice to map Shameful Display - the first event they play during each conflict at that province will also modify its strength');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
            });

            let strength = this.sd1.getStrength();

            this.player2.pass();
            this.player1.clickCard(this.assassination1);
            this.player1.clickCard(this.whisperer);
            this.player1.clickPrompt('Raise attacked province\'s strength by 2');
            expect(this.sd1.getStrength()).toBe(strength + 2);

            this.noMoreActions();

            expect(this.sd1.getStrength()).toBe(strength);

            this.mitsu.bowed = false;
            this.challenger.bowed = false;

            this.noMoreActions();
            this.player2.passConflict();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.mitsu],
                province: this.sd1,
                ring: 'fire',
                type: 'political'
            });

            this.player2.pass();
            this.player1.clickCard(this.letgo);
            this.player1.clickCard(this.invocation);
            this.player1.clickPrompt('Raise attacked province\'s strength by 2');
            expect(this.sd1.getStrength()).toBe(strength + 2);
        });
    });
});
