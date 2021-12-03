describe('Khanbulak Benefactor Reprint', function() {
    integration(function() {
        describe('Dynasty Phase', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['khanbulak-philanthropist']
                    }
                });

                this.khanbulak = this.player1.placeCardInProvince('khanbulak-philanthropist', 'province 1');
            });

            it('should draw a card when played from a province', function() {
                this.player1.clickCard(this.khanbulak);
                this.player1.clickPrompt('1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);

                let hand = this.player1.hand.length;
                this.player1.clickCard(this.khanbulak);
                expect(this.player1.hand.length).toBe(hand + 1);

                expect(this.getChatLogs(3)).toContain('player1 uses Khanbulak Philanthropist to draw 1 card');
            });
        });

        describe('Conflict Phase Interactions', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        honor: 15,
                        inPlay: ['khanbulak-philanthropist', 'border-rider', 'daidoji-uji'],
                        dynastyDiscard: ['khanbulak-philanthropist', 'shinjo-kyora'],
                        hand: ['charge', 'steward-of-law', 'fine-katana', 'way-of-the-dragon', 'forebearer-s-echoes', 'way-of-the-crane'],
                        conflictDiscard: ['right-hand-of-the-emperor']
                    },
                    player2: {
                        honor: 10
                    }
                });

                this.khanbulak = this.player1.findCardByName('khanbulak-philanthropist', 'play area');
                this.khanbulak2 = this.player1.findCardByName('khanbulak-philanthropist', 'dynasty discard pile');
                this.kyora = this.player1.placeCardInProvince('shinjo-kyora', 'province 1');
                this.rider = this.player1.findCardByName('border-rider');
                this.echoes = this.player1.findCardByName('forebearer-s-echoes');
                this.charge = this.player1.findCardByName('charge');
                this.steward = this.player1.findCardByName('steward-of-law');
                this.katana = this.player1.findCardByName('fine-katana');
                this.dragon = this.player1.findCardByName('way-of-the-dragon');

                this.uji = this.player1.findCardByName('daidoji-uji');
                this.crane = this.player1.findCardByName('way-of-the-crane');

                this.rightHand = this.player1.findCardByName('right-hand-of-the-emperor');

                this.khanbulak.fate = 0;

                this.noMoreActions();
            });

            it('should not work if not participating', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.rider],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.dragon);
                this.player1.clickCard(this.rider);
                expect(this.player1.fate).toBe(fate - 2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should interrupt if participating', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.dragon);
                this.player1.clickCard(this.rider);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);
                this.player1.clickCard(this.khanbulak);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.getChatLogs(5)).toContain('player1 uses Khanbulak Philanthropist to reduce the cost of their next card by 1');
            });

            it('should not interrupt if card costs 0', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.katana);
                this.player1.clickCard(this.rider);
                expect(this.player1.fate).toBe(fate);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on characters from hand', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.steward);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);
                this.player1.clickCard(this.khanbulak);
                this.player1.clickPrompt('0');
                this.player1.clickPrompt('Conflict');
                expect(this.player1.fate).toBe(fate);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('should work on events (& reaction should work on being put into play)', function() {
                const fate = this.player1.fate;
                const hand = this.player1.hand.length;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.khanbulak2);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);
                this.player1.clickCard(this.khanbulak);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak2);
                this.player1.clickCard(this.khanbulak2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
                expect(this.player1.hand.length).toBe(hand); //-1 from echoes, +1 from draw
            });

            it('should stack', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.echoes);
                this.player1.clickCard(this.khanbulak2);
                this.player1.pass();
                this.player1.clickCard(this.khanbulak2);
                expect(this.player1.fate).toBe(fate - 2);
                this.player2.pass();
                this.player1.clickCard(this.dragon);
                this.player1.clickCard(this.khanbulak);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);
                expect(this.player1).toBeAbleToSelect(this.khanbulak2);
                this.player1.clickCard(this.khanbulak);
                this.player1.clickCard(this.khanbulak2);
                expect(this.player1.fate).toBe(fate - 2); //2 fate reduction
            });

            it('should work with disguised', function() {
                const fate = this.player1.fate;

                this.initiateConflict({
                    attackers: [this.khanbulak],
                    defenders: [],
                    type: 'military'
                });

                this.player2.pass();
                this.player1.clickCard(this.kyora);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.khanbulak);
                this.player1.clickCard(this.khanbulak);
                this.player1.clickCard(this.rider);
                expect(this.player1.fate).toBe(fate - 1);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
