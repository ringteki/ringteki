describe('Superior Authority', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['brash-samurai', 'doji-challenger', 'daidoji-uji'],
                    hand: ['superior-authority'],
                    dynastyDiscard: ['favorable-ground']
                },
                player2: {
                    inPlay: ['moto-youth', 'cunning-negotiator', 'doji-hotaru'],
                    hand: ['charge', 'called-to-war'],
                    dynastyDiscard: ['moto-chagatai']
                }
            });

            this.brash = this.player1.findCardByName('brash-samurai');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.uji = this.player1.findCardByName('daidoji-uji');
            this.youth = this.player2.findCardByName('moto-youth');
            this.negotiator = this.player2.findCardByName('cunning-negotiator');
            this.hotaru = this.player2.findCardByName('doji-hotaru');

            this.ground = this.player1.placeCardInProvince('favorable-ground', 'province 1');
            this.authority = this.player1.findCardByName('superior-authority');
            this.charge = this.player2.findCardByName('charge');
            this.calledToWar = this.player2.findCardByName('called-to-war');
            this.chagatai = this.player2.placeCardInProvince('moto-chagatai', 'province 1');
        });

        it('should not trigger outside of a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.authority);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should prevent characters with 0 fate from counting skill', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            expect(this.game.currentConflict.attackerSkill).toBe(3);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
        });

        it('should not prevent characters with one or more fate from counting skill', function() {
            this.noMoreActions();
            this.negotiator.fate = 1;

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            expect(this.game.currentConflict.attackerSkill).toBe(3);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
        });

        it('should not be able to play if there are no characters with 0 fate', function() {
            this.noMoreActions();
            this.challenger.fate = 1;
            this.negotiator.fate = 1;

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should not prevent characters that move into the conflict from contributing', function() {
            this.noMoreActions();
            this.negotiator.fate = 1;

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            expect(this.game.currentConflict.attackerSkill).toBe(3);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.ground);
            this.player1.clickCard(this.uji);
            expect(this.game.currentConflict.attackerSkill).toBe(6);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
        });

        it('should not prevent characters that are put into play into the conflict from contributing', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            expect(this.game.currentConflict.attackerSkill).toBe(3);
            expect(this.game.currentConflict.defenderSkill).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
            this.player2.clickCard(this.charge);
            this.player2.clickCard(this.chagatai);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(6);
        });

        it('should not allow you to contribute if you put fate on the character', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.hotaru],
                type: 'military'
            });

            expect(this.game.currentConflict.attackerSkill).toBe(3);
            expect(this.game.currentConflict.defenderSkill).toBe(3);
            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
            this.player2.clickCard(this.calledToWar);
            this.player2.clickCard(this.hotaru);
            this.player1.clickPrompt('Yes');
            this.player1.clickCard(this.challenger);
            expect(this.game.currentConflict.attackerSkill).toBe(0);
            expect(this.game.currentConflict.defenderSkill).toBe(0);
        });

        it('chat message', function() {
            this.noMoreActions();

            this.initiateConflict({
                attackers: [this.challenger],
                defenders: [this.negotiator],
                type: 'military'
            });

            this.player2.pass();
            this.player1.clickCard(this.authority);
            expect(this.getChatLogs(5)).toContain('player1 plays Superior Authority to make all participating characters with 0 fate not contribute skill to conflict resolution. This affects: Doji Challenger and Cunning Negotiator');
        });
    });
});
