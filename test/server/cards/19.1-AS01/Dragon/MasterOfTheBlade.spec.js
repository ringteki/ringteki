describe('Master of the Blade', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade', 'mirumoto-raitsugu'],
                    hand: ['fine-katana', 'dragon-s-fang', 'dragon-s-claw', 'a-new-name', 'inscribed-tanto']
                },
                player2: {
                    inPlay: ['doji-challenger', 'doji-kuwanan']
                }
            });

            this.masterOfTheBlade = this.player1.findCardByName('master-of-the-blade');
            this.raitsugu = this.player1.findCardByName('mirumoto-raitsugu');

            this.dragonsClaw = this.player1.findCardByName('dragon-s-claw');
            this.dragonsFang = this.player1.findCardByName('dragon-s-fang');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.tanto = this.player1.findCardByName('inscribed-tanto');
            this.ann = this.player1.findCardByName('a-new-name');

            this.challenger = this.player2.findCardByName('doji-challenger');
            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.kuwanan.honor();

            this.player1.playAttachment(this.tanto, this.masterOfTheBlade);
            this.player2.pass();
            this.player1.playAttachment(this.dragonsFang, this.masterOfTheBlade);
            this.player2.pass();
            this.player1.playAttachment(this.dragonsClaw, this.masterOfTheBlade);
            this.player2.pass();
            this.player1.playAttachment(this.ann, this.masterOfTheBlade);
            this.player2.pass();
            this.player1.playAttachment(this.fineKatana, this.raitsugu);
        });

        it('should prompt you to bow an attached weapon', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            expect(this.player1).toHavePrompt('Select card to bow');
            expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
            expect(this.player1).toBeAbleToSelect(this.dragonsFang);
            expect(this.player1).toBeAbleToSelect(this.dragonsClaw);
            expect(this.player1).toBeAbleToSelect(this.tanto);
            expect(this.player1).not.toBeAbleToSelect(this.ann);
        });

        it('if you win the duel should prompt you to decide if you want to sacrifice a weapon', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).toHavePromptButton('Sacrifice a weapon to discard loser');
            expect(this.player1).toHavePromptButton('Bow loser');
            expect(this.getChatLogs(10)).toContain('player1 uses Master of the Blade, bowing Inscribed Tantō to initiate a military duel : Master of the Blade vs. Doji Challenger');
            expect(this.getChatLogs(10)).toContain('Duel Effect: bow or discard Doji Challenger');
        });

        it('sacrificing a weapon should discard', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player1.clickPrompt('Sacrifice a weapon to discard loser');

            expect(this.player1).toHavePrompt('Choose a card');
            expect(this.player1).not.toBeAbleToSelect(this.fineKatana);
            expect(this.player1).toBeAbleToSelect(this.dragonsFang);
            expect(this.player1).toBeAbleToSelect(this.dragonsClaw);
            expect(this.player1).not.toBeAbleToSelect(this.tanto);
            expect(this.player1).not.toBeAbleToSelect(this.ann);

            this.player1.clickCard(this.dragonsClaw);
            expect(this.challenger.location).toBe('dynasty discard pile');
            expect(this.dragonsClaw.location).toBe('conflict discard pile');

            expect(this.getChatLogs(10)).toContain('player1 chooses to sacrifice a weapon to discard Doji Challenger');
            expect(this.getChatLogs(10)).toContain('player1 sacrifices Dragon\'s Claw');
        });

        it('not sacrificing a weapon should bow', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player1.clickPrompt('Bow loser');

            expect(this.player1).not.toHavePrompt('Choose a card');
            expect(this.challenger.bowed).toBe(true);
            expect(this.challenger.location).toBe('play area');

            expect(this.getChatLogs(10)).toContain('player1 chooses to bow Doji Challenger');
        });

        it('should let you choose to bow even if loser is already bowed', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.challenger.bow();
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player1).toHavePromptButton('Sacrifice a weapon to discard loser');
            expect(this.player1).toHavePromptButton('Bow loser');
            this.player1.clickPrompt('Bow loser');

            expect(this.player1).not.toHavePrompt('Choose a card');
            expect(this.challenger.location).toBe('play area');

            expect(this.getChatLogs(10)).toContain('player1 chooses to bow Doji Challenger');
        });

        it('if you lose the duel should not prompt you to decide if you want to sacrifice a weapon', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.kuwanan);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('5');

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('player1 uses Master of the Blade, bowing Inscribed Tantō to initiate a military duel : Master of the Blade vs. Doji Kuwanan');
            expect(this.getChatLogs(10)).toContain('Duel Effect: bow Master of the Blade');
        });

        it('if you don\'t have a weapon to sac should not prompt you to decide if you want to sacrifice a weapon', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade, this.raitsugu],
                defenders: [this.challenger, this.kuwanan]
            });
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.kuwanan);
            this.player1.clickCard(this.tanto);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            this.player1.clickPrompt('Sacrifice a weapon to discard loser');
            this.player1.clickCard(this.dragonsFang);
            this.player2.pass();
            this.player1.clickCard(this.masterOfTheBlade);
            this.player1.clickCard(this.challenger);
            this.player1.clickCard(this.dragonsClaw);

            this.player1.clickPrompt('1');
            this.player2.clickPrompt('1');

            expect(this.player2).toHavePrompt('Conflict Action Window');
            expect(this.getChatLogs(10)).toContain('player1 uses Master of the Blade, bowing Dragon\'s Claw to initiate a military duel : Master of the Blade vs. Doji Challenger');
            expect(this.getChatLogs(10)).toContain('Duel Effect: bow Doji Challenger');
        });
    });
});
