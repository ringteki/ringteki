describe('Endless Plains Skirmisher', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['endless-plains-skirmisher', 'ikoma-prodigy'],
                    hand: ['display-of-power', 'spyglass', 'finger-of-jade']
                },
                player2: {
                    inPlay: ['solemn-scholar']
                }
            });

            this.skirmisher = this.player1.findCardByName('endless-plains-skirmisher');
            this.ikomaProdigy = this.player1.findCardByName('ikoma-prodigy');
            this.displayOfPower = this.player1.findCardByName('display-of-power');
            this.spyglass = this.player1.findCardByName('spyglass');
            this.jade = this.player1.findCardByName('finger-of-jade');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
        });

        it('should count skill for opponent', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ikomaProdigy],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');

            this.player1.clickPrompt('My Opponent\'s');
            expect(this.game.currentConflict.attackers).not.toContain(this.skirmisher);
            expect(this.game.currentConflict.defenders).toContain(this.skirmisher);

            expect(this.getChatLogs(3)).toContain('player1 uses Endless Plains Skirmisher to join the conflict for player2!');
            expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 0 Defender: 3');
            expect(this.getChatLogs(1)).toContain('Defender is winning the conflict');

            this.noMoreActions();
            expect(this.game.rings.air.claimedBy).toBe(this.player2.player.name);
        });

        it('should count skill for myself', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ikomaProdigy],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');

            this.player1.clickPrompt('Mine');
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher);
            expect(this.game.currentConflict.defenders).not.toContain(this.skirmisher);

            expect(this.getChatLogs(3)).toContain('player1 uses Endless Plains Skirmisher to join the conflict for player1!');
            expect(this.getChatLogs(2)).toContain('Military Air conflict - Attacker: 3 Defender: 0');
            expect(this.getChatLogs(1)).toContain('Attacker is winning the conflict - Shameful Display is breaking!');

            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
        });

        it('should still be controlled by owner', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ikomaProdigy],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');

            this.player1.clickPrompt('My Opponent\'s');
            this.player2.pass();
            this.player1.clickCard(this.jade);
            expect(this.player1).toBeAbleToSelect(this.skirmisher);
            this.player1.clickCard(this.skirmisher);
            expect(this.jade.location).toBe('play area');
        });

        it('should trigger spyglass - my side', function() {
            this.player1.clickCard(this.spyglass);
            this.player1.clickCard(this.skirmisher);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ikomaProdigy],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');

            this.player1.clickPrompt('Mine');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.spyglass);
        });

        it('should trigger spyglass - opponent\'s side', function() {
            this.player1.clickCard(this.spyglass);
            this.player1.clickCard(this.skirmisher);
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.ikomaProdigy],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');

            this.player1.clickPrompt('My Opponent\'s');
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.spyglass);
        });

        it('should count as unopposed (allow display of power, take the honor hit)', function() {
            let honor = this.player1.honor;
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.solemnScholar],
                defenders: [],
                type: 'political',
                ring: 'air'
            });

            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Which side should this character be on?');
            expect(this.player1).toHavePromptButton('Mine');
            expect(this.player1).toHavePromptButton('My Opponent\'s');
            this.player1.clickPrompt('My Opponent\'s');
            expect(this.game.currentConflict.attackers).toContain(this.skirmisher);
            expect(this.game.currentConflict.defenders).not.toContain(this.skirmisher);

            expect(this.getChatLogs(3)).toContain('player1 uses Endless Plains Skirmisher to join the conflict for player2!');
            expect(this.getChatLogs(2)).toContain('Political Air conflict - Attacker: 1 Defender: 0');
            expect(this.getChatLogs(1)).toContain('Attacker is winning the conflict');

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.displayOfPower);
            this.player1.clickCard(this.displayOfPower);

            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.player1.honor).toBe(honor - 1);
            expect(this.game.rings.air.claimedBy).toBe(this.player1.player.name);
        });

        it('should not work if already in conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.skirmisher],
                defenders: [],
                type: 'military',
                ring: 'air'
            });

            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.skirmisher);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });
    });
});
