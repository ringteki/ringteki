describe('The Living Gate', function () {
    integration(function () {
        describe('While it has a shugenja with it', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['the-living-gate', 'solemn-scholar']
                    },
                    player2: {
                        inPlay: [],
                        hand: ['assassination']
                    }
                });

                this.livingGate =
                    this.player1.findCardByName('the-living-gate');
                this.solemn = this.player1.findCardByName('solemn-scholar');
                this.assassination =
                    this.player2.findCardByName('assassination');
            });

            it('cannot be discarded by actions', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.livingGate, this.solemn],
                    defenders: []
                });

                this.player2.clickCard(this.assassination);
                expect(this.player2).toBeAbleToSelect(this.solemn);
                expect(this.livingGate.location).toBe('play area');
                expect(this.player2).not.toBeAbleToSelect(this.livingGate);
            });

            it('cannot be discarded by the fate phase discard', function () {
                this.solemn.fate = 1;
                this.flow.finishConflictPhase();
                expect(this.player1).toHavePrompt(
                    'Select dynasty cards to discard'
                );
                expect(this.solemn.location).toBe('play area');
                expect(this.solemn.fate).toBe(0);
                expect(this.player1).not.toBeAbleToSelect(this.solemn);
                expect(this.livingGate.fate).toBe(0);
                expect(this.player1).not.toBeAbleToSelect(this.livingGate);
            });
        });

        describe('When it does not have a shugenja with it', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: [
                            'the-living-gate',
                            'solemn-scholar',
                            'keeper-initiate'
                        ]
                    },
                    player2: {
                        inPlay: [],
                        hand: ['assassination']
                    }
                });

                this.livingGate =
                    this.player1.findCardByName('the-living-gate');
                this.solemn = this.player1.findCardByName('solemn-scholar');
                this.keeperInitiate =
                    this.player1.findCardByName('keeper-initiate');
                this.assassination =
                    this.player2.findCardByName('assassination');
            });

            it('gets discarded if their shugenja is discarded', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.livingGate, this.solemn],
                    defenders: []
                });

                this.player2.clickCard(this.assassination);
                this.player2.clickCard(this.solemn);
                expect(this.livingGate.location).toBe('conflict discard pile');
                expect(this.getChatLogs(3)).toContain(
                    'The Living Gate is discarded from play because player1 controls no Shugenja at their location'
                );
            });

            it('gets discarded if it initiates a conflict without a shugenja', function () {
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.livingGate, this.keeperInitiate],
                    defenders: []
                });

                expect(this.livingGate.location).toBe('conflict discard pile');
                expect(this.getChatLogs(5)).toContain(
                    'The Living Gate is discarded from play because player1 controls no Shugenja at their location'
                );
            });

            it('gets discarded during the fate phase even if it has fate, if there is not shugenja with it', function () {
                this.livingGate.fate = 1;
                this.flow.finishConflictPhase();
                this.player1.clickPrompt('Done');

                expect(this.solemn.location).toBe('dynasty discard pile');
                expect(this.livingGate.location).toBe('conflict discard pile');
                expect(this.getChatLogs(5)).toContain(
                    'The Living Gate is discarded from play because player1 controls no Shugenja at their location'
                );
            });
        });
    });
});
