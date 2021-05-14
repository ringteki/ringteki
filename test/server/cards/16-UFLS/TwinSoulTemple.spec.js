describe('Twin Soul Temple', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['asako-azunami', 'isawa-kaede', 'master-alchemist', 'fire-tensai-acolyte', 'henshin-disciple', 'kakita-toshimoko', 'kuni-yori'],
                    provinces: ['pilgrimage', 'honor-s-reward', 'manicured-garden', 'tsuma'],
                    dynastyDiscard: ['alchemical-laboratory'],
                    stronghold: ['twin-soul-temple']
                },
                player2: {
                    inPlay: ['prodigy-of-the-waves', 'doji-challenger', 'sadane-student'],
                    stronghold: ['twin-soul-temple']
                }
            });

            this.twinSoul1 = this.player1.findCardByName('twin-soul-temple');
            this.twinSoul2 = this.player2.findCardByName('twin-soul-temple');
            
            this.azunami = this.player1.findCardByName('asako-azunami');
            this.kaede = this.player1.findCardByName('isawa-kaede');
            this.alchemist = this.player1.findCardByName('master-alchemist');
            this.fireTensai = this.player1.findCardByName('fire-tensai-acolyte');
            this.henshin = this.player1.findCardByName('henshin-disciple');
            this.toshimoko = this.player1.findCardByName('kakita-toshimoko');
            this.yori = this.player1.findCardByName('kuni-yori');
            this.lab = this.player1.findCardByName('alchemical-laboratory');

            this.pilgrimage = this.player1.findCardByName('pilgrimage');
            this.reward = this.player1.findCardByName('honor-s-reward');
            this.garden = this.player1.findCardByName('manicured-garden');
            this.tsuma = this.player1.findCardByName('tsuma');

            this.prodigy = this.player2.findCardByName('prodigy-of-the-waves');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.student = this.player2.findCardByName('sadane-student');

            this.garden.facedown = true;
            this.pilgrimage.facedown = false;
            this.reward.facedown =false;
            this.tsuma.facedown = false;
            this.player1.placeCardInProvince(this.yori, 'province 1');
            this.player1.placeCardInProvince(this.lab, 'province 2');
            this.lab.facedown = false;
            this.yori.facedown = false;
            this.game.checkGameState(true);
        });

        it('should prompt you to select a card with an element symbol', function() {
            this.player1.clickCard(this.twinSoul1);
            expect(this.player1).toHavePrompt('Choose an element to replace');
            expect(this.player1).toBeAbleToSelect(this.azunami);
            expect(this.player1).toBeAbleToSelect(this.kaede);
            expect(this.player1).toBeAbleToSelect(this.alchemist);
            expect(this.player1).toBeAbleToSelect(this.fireTensai);
            expect(this.player1).toBeAbleToSelect(this.henshin);
            expect(this.player1).not.toBeAbleToSelect(this.toshimoko);
            expect(this.player1).not.toBeAbleToSelect(this.yori);
            expect(this.player1).toBeAbleToSelect(this.lab);
            expect(this.player1).toBeAbleToSelect(this.pilgrimage);
            expect(this.player1).not.toBeAbleToSelect(this.garden);
            expect(this.player1).toBeAbleToSelect(this.tsuma);
            expect(this.player1).toBeAbleToSelect(this.reward);

            expect(this.player1).toBeAbleToSelect(this.prodigy);
            expect(this.player1).not.toBeAbleToSelect(this.challenger);
            expect(this.player1).toBeAbleToSelect(this.student);
        });

        it('should prompt you to pick a new element', function() {
            this.player1.clickCard(this.twinSoul1);
            expect(this.player1).toHavePrompt('Choose an element to replace');
            this.player1.clickCard(this.prodigy);
            expect(this.player1).toHavePrompt('Choose the new element');
            expect(this.player1).toHavePromptButton('Air');
            expect(this.player1).toHavePromptButton('Earth');
            expect(this.player1).toHavePromptButton('Fire');
            expect(this.player1).toHavePromptButton('Void');
            expect(this.player1).not.toHavePromptButton('Water');
        });

        it('should change the element', function() {
            this.prodigy.bow();
            this.player1.clickCard(this.twinSoul1);
            expect(this.player1).toHavePrompt('Choose an element to replace');
            this.player1.clickCard(this.prodigy);
            this.player1.clickPrompt('Air');

            expect(this.getChatLogs(10)).toContain('player1 uses Twin Soul Temple, bowing Twin Soul Temple to replace a printed element symbol with a different one');
            expect(this.getChatLogs(10)).toContain('player1 replaces Prodigy of the Waves\'s Claimed Ring (Water) symbol with Air');

            this.player1.claimRing('water');
            this.game.checkGameState(true);
            this.player2.clickCard(this.prodigy);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.prodigy.bowed).toBe(true);
            this.player1.claimRing('air');
            this.game.checkGameState(true);
            this.player2.clickCard(this.prodigy);
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.prodigy.bowed).toBe(false);
        });

        it('Kaede', function() {
            this.prodigy.fate = 4;
            this.player1.clickCard(this.twinSoul1);
            this.player1.clickCard(this.kaede);
            this.player1.clickPrompt('Earth');

            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                ring: 'fire',
                attackers: [this.kaede],
                defenders: [this.challenger]
            });

            this.noMoreActions();
            expect(this.player1).toHavePrompt('Resolve Ring Effect');
            this.player1.clickPrompt('Resolve All Elements');
            expect(this.player1).toHavePrompt('Choose an effect to be resolved');
            expect(this.player1.currentButtons).toContain('Fire Ring Effect');
            expect(this.player1.currentButtons).toContain('Earth Ring Effect');
            expect(this.player1.currentButtons).not.toContain('Void Ring Effect');
        });

        describe('Fire Tensai Acolyte', function() {
            beforeEach(function() {
                this.player1.clickCard(this.twinSoul1);
                this.player1.clickCard(this.fireTensai);
                this.player1.clickPrompt('Void');
                this.noMoreActions();
            });

            it('should not be able to attack during non-void conflicts', function() {
                this.initiateConflict({
                    type: 'military',
                    ring: 'fire',
                    attackers: [this.acolyte, this.azunami],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.azunami);
                expect(this.game.currentConflict.attackers).not.toContain(this.acolyte);
            });

            it('should be able to attack during void conflicts', function() {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    ring: 'void',
                    attackers: [this.acolyte, this.azunami],
                    defenders: []
                });
                expect(this.game.currentConflict.attackers).toContain(this.azunami);
                expect(this.game.currentConflict.attackers).toContain(this.acolyte);
            });
        });
    });
});