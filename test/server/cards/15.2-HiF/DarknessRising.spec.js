describe('Darkness Rising', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 6,
                    inPlay: ['hida-kisada', 'yoritomo', 'kaiu-siege-force', 'eager-scout', 'siege-captain'],
                    hand: ['darkness-rising']
                },
                player2: {
                    inPlay: ['matsu-seventh-legion', 'matsu-berserker', 'akodo-toturi']
                }
            });

            this.kisada = this.player1.findCardByName('hida-kisada');
            this.yoritomo = this.player1.findCardByName('yoritomo');
            this.kaiuSiegeForce = this.player1.findCardByName('kaiu-siege-force');
            this.eagerScout = this.player1.findCardByName('eager-scout');
            this.siegeCaptain = this.player1.findCardByName('siege-captain');
            this.kisada.fate = 2;

            this.darknessRising = this.player1.findCardByName('darkness-rising');

            this.seventhLegion = this.player2.findCardByName('matsu-seventh-legion');
            this.matsuBerserker = this.player2.findCardByName('matsu-berserker');
            this.toturi = this.player2.findCardByName('akodo-toturi');
        });

        it('should dishonor a character of player\'s choice and bow all weaker participating characters', function() {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.kisada, this.yoritomo, this.kaiuSiegeForce, this.siegeCaptain],
                defenders: [this.seventhLegion, this.toturi]
            });

            this.player2.pass();

            this.player1.clickCard(this.darknessRising);
            this.player1.clickCard(this.kisada);
            this.player1.clickPrompt('2');
            expect(this.player1).toHavePrompt('Choose a character to dishonor');
            this.player1.clickCard(this.kisada);

            expect(this.kisada.isDishonored).toBe(2);
            expect(this.kisada.fate).toBe(0);

            expect(this.yoritomo.militarySkill).toBe(10);
            expect(this.yoritomo.bowed).toBe(false); // 10 vs 7
            expect(this.kaiuSiegeForce.bowed).toBe(false); // 7v7
            expect(this.seventhLegion.bowed).toBe(false); // 7v7
            expect(this.matsuBerserker.bowed).toBe(false); // non-participating
            expect(this.eagerScout.bowed).toBe(false); // non-participating
            expect(this.kisada.bowed).toBe(false); // source and same skill

            expect(this.toturi.bowed).toBe(true); //6v7
            expect(this.siegeCaptain.bowed).toBe(true); // 5v7
        });
    });
});
