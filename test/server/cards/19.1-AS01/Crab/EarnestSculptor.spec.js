describe('Earnest Sculptor', function () {
    integration(function () {
        describe('Constant ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        fate: 1,
                        inPlay: ['earnest-sculptor'],
                        hand: [
                            'jade-talisman',
                            'jade-strike',
                            'finger-of-jade',
                            'jade-tetsubo'
                        ]
                    },
                    player2: {
                        inPlay: ['goblin-sneak']
                    }
                });

                this.goblinSneakDishonored =
                    this.player2.findCardByName('goblin-sneak');
                this.goblinSneakDishonored.dishonor();
            });

            it('allows players to pay 0 cost cards with 0 fate', function () {
                this.player1.fate = 0;
                this.jadeTalisman = this.player1.playAttachment(
                    'jade-talisman',
                    'earnest-sculptor'
                );
                expect(this.jadeTalisman.location).toBe('play area');
            });

            it('allows players to pay 1 cost cards with 0 fate', function () {
                this.player1.fate = 0;
                this.fingerOfJade = this.player1.playAttachment(
                    'finger-of-jade',
                    'earnest-sculptor'
                );
                expect(this.fingerOfJade.location).toBe('play area');
            });

            it('allows players to pay 2 cost cards with 1 fate', function () {
                this.player1.fate = 1;
                this.jadeTetsubo = this.player1.playAttachment(
                    'jade-tetsubo',
                    'earnest-sculptor'
                );
                expect(this.jadeTetsubo.location).toBe('play area');
            });

            it('allows playing events with discount', function () {
                this.player1.fate = 0;
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: ['earnest-sculptor'],
                    defenders: [this.goblinSneakDishonored]
                });

                this.player2.pass();

                this.player1.clickCard('jade-strike');
                expect(this.player1).toHavePrompt('Choose a character');
            });
        });

        describe('Earnest Sculptor\'s search ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['earnest-sculptor'],
                        conflictDeck: [
                            'hurricane-punch',
                            'against-the-waves',
                            'mantra-of-fire',
                            'censure',
                            'cloud-the-mind'
                        ],
                        conflictDeckSize: 5
                    },
                    player2: {}
                });
                this.earnestSculptor =
                    this.player1.findCardByName('earnest-sculptor');
                this.cloudTheMind =
                    this.player1.findCardByName('cloud-the-mind');
            });

            it('should prompt to choose from the top 5 cards for a spell', function () {
                this.player1.clickCard(this.earnestSculptor);
                expect(this.player1).toHavePrompt('Select a card to reveal');
                expect(this.player1).toHaveDisabledPromptButton(
                    'Hurricane Punch'
                );
                expect(this.player1).toHavePromptButton('Against the Waves');
                expect(this.player1).toHaveDisabledPromptButton(
                    'Mantra of Fire'
                );
                expect(this.player1).toHaveDisabledPromptButton('Censure');
                expect(this.player1).toHavePromptButton('Cloud the Mind');
            });

            it('should reveal the chosen attachment', function () {
                this.player1.clickCard(this.earnestSculptor);
                this.player1.clickPrompt('Cloud the Mind');
                expect(this.getChatLogs(2)).toContain(
                    'player1 takes Cloud the Mind'
                );
            });

            it('should add the chosen card to your hand', function () {
                this.player1.clickCard(this.earnestSculptor);
                this.player1.clickPrompt('Cloud the Mind');
                expect(this.cloudTheMind.location).toBe('hand');
            });

            it('should shuffle the conflict deck', function () {
                this.player1.clickCard(this.earnestSculptor);
                this.player1.clickPrompt('Cloud the Mind');
                expect(this.getChatLogs(1)).toContain(
                    'player1 is shuffling their conflict deck'
                );
            });

            it('should allow you to choose to take nothing', function () {
                this.player1.clickCard(this.earnestSculptor);
                expect(this.player1).toHavePromptButton('Take nothing');
                this.player1.clickPrompt('Take nothing');
                expect(this.getChatLogs(2)).toContain('player1 takes nothing');
                expect(this.getChatLogs(1)).toContain(
                    'player1 is shuffling their conflict deck'
                );
            });
        });
    });
});
