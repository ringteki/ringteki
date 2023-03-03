describe('Ichigo-kun', function () {
    integration(function () {
        describe('Ichigo-kun cannot be evaded', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['shameful-display']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');

                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
            });

            it('should not be able to be evaded by covert', function () {
                this.noMoreActions();
                this.player1.passConflict();

                this.noMoreActions();
                expect(this.player2).toHavePrompt('initiate conflict');
                this.player2.clickCard(this.ikehata);
                this.player2.clickRing('air');
                this.player2.clickCard(this.shamefulDisplay1);

                expect(this.player2).toHavePromptButton('Initiate Conflict');
                this.player2.clickPrompt('Initiate Conflict');

                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player1.clickCard(this.ichigoKun);
                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(true);
                expect(this.ikehata.isAttacking()).toBe(true);
            });
        });

        describe('Ichigo-kun during fire conflicts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata'],
                        hand: ['elemental-inversion'],
                        provinces: ['shameful-display']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
                this.elementalInversion = this.player2.findCardByName('elemental-inversion');
            });

            it('cannot be declared as an attacker', function () {
                this.noMoreActions();

                expect(this.player1).toHavePrompt('initiate conflict');

                this.player1.clickCard(this.shamefulDisplay1);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isAttacking()).toBe(false);
                expect(this.game.currentConflict.element).toBe('fire');
                expect(this.game.currentConflict.attackers).not.toContain(this.ichigoKun);
            });

            it('cannot be declared as a defender', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                expect(this.player2).toHavePrompt('initiate conflict');

                this.player2.clickCard(this.manicuredGarden);
                this.player2.clickRing('fire');
                this.player2.clickCard(this.ikehata);
                this.player2.clickPrompt('Initiate Conflict');
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.ichigoKun);
            });

            it('cannot participate should the ring become fire', function () {
                this.noMoreActions();

                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: []
                });

                this.player2.clickCard(this.elementalInversion);
                this.player2.clickRing('fire');

                expect(this.getChatLogs(3)).toContain(
                    'Ichigo-kun cannot participate in the conflict any more and is sent home bowed'
                );
            });
        });

        describe('Ichigo-kun ability', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'worldly-shiotome']
                    },
                    player2: {
                        inPlay: ['solemn-scholar']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.shiotome = this.player1.findCardByName('worldly-shiotome');

                this.solemn = this.player2.findCardByName('solemn-scholar');
                this.noMoreActions();
            });

            it('does not trigger when alone', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.solemn]
                });

                this.player2.pass();

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
                expect(this.player1).not.toBeAbleToSelect(this.solemn);
                expect(this.player1).not.toBeAbleToSelect(this.shiotome);
            });

            it('gains military on itself and reduces glory of companion', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun, this.shiotome],
                    defenders: [this.solemn]
                });

                this.player2.pass();

                this.player1.clickCard(this.ichigoKun);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
                expect(this.player1).not.toBeAbleToSelect(this.solemn);
                expect(this.player1).toBeAbleToSelect(this.shiotome);

                this.player1.clickCard(this.shiotome);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Increase own military, reduce other glory');
                expect(this.player1).toHavePromptButton('Reduce own military, increase other glory');

                this.player1.clickPrompt('Increase own military, reduce other glory');
                expect(this.ichigoKun.militarySkill).toBe(6);
                expect(this.shiotome.glory).toBe(0);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to give Ichigo-kun +2 military and Worldly Shiotome -2 glory - Ichigo-kun is wild today!'
                );
            });

            it('loses military on itself and increases glory of companion', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun, this.shiotome],
                    defenders: [this.solemn]
                });

                this.player2.pass();

                this.player1.clickCard(this.ichigoKun);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
                expect(this.player1).not.toBeAbleToSelect(this.solemn);
                expect(this.player1).toBeAbleToSelect(this.shiotome);

                this.player1.clickCard(this.shiotome);
                expect(this.player1).toHavePrompt('Select one');
                expect(this.player1).toHavePromptButton('Increase own military, reduce other glory');
                expect(this.player1).toHavePromptButton('Reduce own military, increase other glory');

                this.player1.clickPrompt('Reduce own military, increase other glory');
                expect(this.ichigoKun.militarySkill).toBe(2);
                expect(this.shiotome.glory).toBe(4);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to give Ichigo-kun -2 military and Worldly Shiotome +2 glory - Ichigo-kun is well-behaved. Impressive!'
                );
            });
        });
    });
});
