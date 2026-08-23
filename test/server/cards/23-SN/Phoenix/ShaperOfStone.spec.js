describe('Shaper of Stone', function () {
    integration(function () {
        describe('Province strength mods', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shaper-of-stone'],
                        provinces: ['midnight-revels', 'manicured-garden']
                    },
                    player2: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['fertile-fields', 'pilgrimage']
                    }
                });

                this.revels1 = this.player1.findCardByName('midnight-revels', 'province 1');
                this.manicured1 = this.player1.findCardByName('manicured-garden', 'province 2');

                this.fertileFields = this.player2.findCardByName('fertile-fields', 'province 1');
                this.pilgrimage = this.player2.findCardByName('pilgrimage', 'province 2');

                this.revels1.facedown = false;
                this.fertileFields.facedown = false;

                this.manicured1.facedown = false;
                this.pilgrimage.facedown = false;
                this.game.checkGameState();
                this.player1.pass();
            });

            it('should lower the province strength of enemy province by 1', function () {
                const fertileEnemyBaseStr = this.fertileFields.baseStrength;
                const pilgrimageEnemyBaseStr = this.pilgrimage.baseStrength;


                expect(this.fertileFields.strength).toBe(fertileEnemyBaseStr - 1);
                expect(this.pilgrimage.strength).toBe(pilgrimageEnemyBaseStr - 1);
            });

            it('should raise the province strength of your province by 1', function () {
                const revelsFriendlyBaseStr = this.revels1.baseStrength;
                const manicuredFriendlyBaseStr = this.manicured1.baseStrength;

                expect(this.revels1.strength).toBe(revelsFriendlyBaseStr + 1);
                expect(this.manicured1.strength).toBe(manicuredFriendlyBaseStr + 1);
            });
        });

        describe('Ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'draw',
                    player1: {
                        inPlay: ['shaper-of-stone'],
                        dynastyDiscard: ['shaper-of-stone'],
                        provinces: ['midnight-revels', 'manicured-garden']
                    },
                    player2: {
                        inPlay: ['doji-kuwanan'],
                        provinces: ['fertile-fields', 'pilgrimage']
                    }
                });

                this.shaper = this.player1.findCardByName('shaper-of-stone', 'play area');
                this.shaper2 = this.player1.findCardByName('shaper-of-stone', 'dynasty discard pile');

                this.revels1 = this.player1.findCardByName('midnight-revels', 'province 1');
                this.manicured1 = this.player1.findCardByName('manicured-garden', 'province 2');

                this.fertileFields = this.player2.findCardByName('fertile-fields', 'province 1');
                this.pilgrimage = this.player2.findCardByName('pilgrimage', 'province 2');

                this.sd = this.player1.findCardByName('shameful-display', 'stronghold province');

                this.kuwanan = this.player2.findCardByName('doji-kuwanan');
                this.kuwanan.honor();

                this.revels1.facedown = false;
                this.fertileFields.facedown = false;

                this.manicured1.facedown = false;
                this.pilgrimage.facedown = false;
                this.player1.clickPrompt('1');
                this.player2.clickPrompt('1');
            });

            it('should react to conflict phase starting and give you an honor when the phase ends', function () {
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shaper);
                this.player1.clickCard(this.shaper);
                expect(this.player1).toBeAbleToSelect(this.revels1);
                expect(this.player1).toBeAbleToSelect(this.manicured1);
                expect(this.player1).not.toBeAbleToSelect(this.sd);

                this.player1.clickCard(this.manicured1);

                expect(this.player1).toHavePrompt('Action Window');
                expect(this.getChatLogs(10)).toContain('player1 uses Shaper of Stone to mark Manicured Garden - they will gain 1 honor if the province remains unbroken at the end of the phase');

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();

                let honor = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();

                this.player2.clickPrompt('military');

                expect(this.getChatLogs(10)).toContain('player1 gains 1 honor due to the delayed effect of Shaper of Stone');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1.honor).toBe(honor + 1);
                expect(this.player2.honor).toBe(honor2);
            });

            it('should not given honor if broken', function () {
                this.manicured1.facedown = true;
                this.noMoreActions();
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.shaper);
                this.player1.clickCard(this.shaper);
                expect(this.player1).toBeAbleToSelect(this.revels1);
                expect(this.player1).toBeAbleToSelect(this.manicured1);
                expect(this.player1).not.toBeAbleToSelect(this.sd);

                this.player1.clickCard(this.manicured1);

                expect(this.player1).toHavePrompt('Action Window');
                expect(this.getChatLogs(10)).toContain('player1 uses Shaper of Stone to mark province 2 - they will gain 1 honor if the province remains unbroken at the end of the phase');

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.initiateConflict({
                    attackers: [this.kuwanan],
                    defenders: [],
                    province: this.manicured1
                });
                this.noMoreActions();
                this.player2.clickPrompt('No');
                this.player2.clickPrompt('Don\'t resolve');

                this.noMoreActions();
                this.kuwanan.bowed = false;
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();

                let honor = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();

                this.player2.clickPrompt('military');

                expect(this.getChatLogs(10)).not.toContain('player1 gains 1 honor due to the delayed effect of Shaper of Stone');
                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1.honor).toBe(honor);
                expect(this.player2.honor).toBe(honor2);
            });

            it('should stack', function () {
                this.player1.moveCard(this.shaper2, 'play area');
                this.noMoreActions();
                this.player1.clickCard(this.shaper);
                this.player1.clickCard(this.manicured1);
                this.player1.clickCard(this.shaper2);
                this.player1.clickCard(this.manicured1);

                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();
                this.player2.passConflict();

                let honor = this.player1.honor;
                let honor2 = this.player2.honor;

                this.noMoreActions();

                this.player2.clickPrompt('military');

                expect(this.game.currentPhase).toBe('fate');
                expect(this.player1.honor).toBe(honor + 2);
                expect(this.player2.honor).toBe(honor2);
            });
        });
    });
});
