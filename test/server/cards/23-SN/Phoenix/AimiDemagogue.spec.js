describe('Aimi Demagogue', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['aimi-demagogue', 'guardian-kami']
                },
                player2: {
                    inPlay: ['akodo-gunso', 'wandering-ronin']
                }
            });

            this.demagogue = this.player1.findCardByName('aimi-demagogue');
            this.guardianKami = this.player1.findCardByName('guardian-kami');

            this.akodoGunso = this.player2.findCardByName('akodo-gunso');
            this.wanderingRonin = this.player2.findCardByName('wandering-ronin');
        });

        it('if picking my own character should just give one pride', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.demagogue, this.guardianKami],
                defenders: [this.akodoGunso, this.wanderingRonin]
            });
            this.player2.pass();
            this.player1.clickCard(this.demagogue);
            expect(this.player1).toBeAbleToSelect(this.demagogue);
            expect(this.player1).toBeAbleToSelect(this.guardianKami);
            expect(this.player1).toBeAbleToSelect(this.akodoGunso);
            expect(this.player1).toBeAbleToSelect(this.wanderingRonin);

            this.player1.clickCard(this.guardianKami);
            expect(this.guardianKami.hasKeyword('pride')).toBe(true);
            expect(this.demagogue.hasKeyword('pride')).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Aimi Demagogue to give Guardian Kami pride the end of the conflict');
        });

        it('if picking opponents character should give two prides', function () {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.demagogue, this.guardianKami],
                defenders: [this.akodoGunso, this.wanderingRonin]
            });
            this.player2.pass();
            this.player1.clickCard(this.demagogue);
            this.player1.clickCard(this.wanderingRonin);
            expect(this.wanderingRonin.hasKeyword('pride')).toBe(true);
            expect(this.demagogue.hasKeyword('pride')).toBe(true);
            expect(this.getChatLogs(5)).toContain('player1 uses Aimi Demagogue to give itself and Wandering Ronin pride the end of the conflict');
        });
    });
});
