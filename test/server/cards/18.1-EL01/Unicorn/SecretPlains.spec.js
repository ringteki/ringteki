describe('Secret Plains', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['keeper-of-secret-names', 'doji-challenger', 'brash-samurai', 'graceful-guardian', 'cautious-scout'],
                    hand: ['fine-katana'],
                    provinces: ['meditations-on-the-tao', 'vassal-fields', 'kuroi-mori', 'rally-to-the-cause'],
                    stronghold: ['secret-plains']
                },
                player2: {
                    inPlay: ['keeper-of-secret-names'],
                    provinces: ['riot-in-the-streets', 'along-the-river-of-gold', 'frostbitten-crossing', 'brother-s-gift-dojo']
                }
            });
            this.plains = this.player1.findCardByName('secret-plains');
            this.p1Keeper = this.player1.findCardByName('keeper-of-secret-names');
            this.challenger = this.player1.findCardByName('doji-challenger');
            this.brash = this.player1.findCardByName('brash-samurai');
            this.guardian = this.player1.findCardByName('graceful-guardian');
            this.katana = this.player1.findCardByName('fine-katana');
            this.scout = this.player1.findCardByName('cautious-scout');

            this.p2Keeper = this.player2.findCardByName('keeper-of-secret-names');

            this.p1Keeper.fate = 2;
            this.p2Keeper.fate = 2;

            // this.manicuredGarden = this.player1.findCardByName('manicured-garden');
            this.meditationsOnTheTao = this.player1.findCardByName('meditations-on-the-tao');
            this.vassalFields = this.player1.findCardByName('vassal-fields');
            this.kuroiMori = this.player1.findCardByName('kuroi-mori');
            this.rallyToTheCause = this.player1.findCardByName('rally-to-the-cause');

            this.riotInTheStreets = this.player2.findCardByName('riot-in-the-streets');
            // this.shamefulDisplay = this.player2.findCardByName('shameful-display');
            this.alongTheRiverOfGold = this.player2.findCardByName('along-the-river-of-gold');
            this.frostbittenCrossing = this.player2.findCardByName('frostbitten-crossing');
            this.brothersGiftDojo = this.player2.findCardByName('brother-s-gift-dojo');

            this.meditationsOnTheTao.facedown = true;
            this.vassalFields.facedown = false;
            this.kuroiMori.isBroken = true;
            this.kuroiMori.facedown = false;
            this.rallyToTheCause.facedown = false;
            this.riotInTheStreets.facedown = false;
            this.alongTheRiverOfGold.facedown = false;
            this.frostbittenCrossing.facedown = false;
            this.brothersGiftDojo.facedown = false;

            this.player1.playAttachment(this.katana, this.p1Keeper);
            this.noMoreActions();
        });

        it('should allow selecting a province with an action that can be used (participating or not)', function() {
            this.challenger.fate = 10;

            this.initiateConflict({
                type: 'military',
                attackers: [this.challenger],
                defenders: [this.p2Keeper]
            });

            this.player2.pass();

            this.player1.clickCard(this.plains);
            expect(this.player1).not.toBeAbleToSelect(this.meditationsOnTheTao);
            expect(this.player1).toBeAbleToSelect(this.vassalFields);
            expect(this.player1).not.toBeAbleToSelect(this.kuroiMori);
            expect(this.player1).not.toBeAbleToSelect(this.rallyToTheCause);
            expect(this.player1).not.toBeAbleToSelect(this.riotInTheStreets);
            expect(this.player1).not.toBeAbleToSelect(this.alongTheRiverOfGold);
            expect(this.player1).not.toBeAbleToSelect(this.frostbittenCrossing);
            expect(this.player1).not.toBeAbleToSelect(this.brothersGiftDojo);
        });

        it('Vassal Fields (province references opponent)', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.p2Keeper],
                defenders: [this.p1Keeper],
                province: this.vassalFields
            });

            let p1fate = this.player1.fate;
            let p2fate = this.player2.fate;

            this.player1.clickCard(this.plains);
            expect(this.player1).toBeAbleToSelect(this.vassalFields);
            this.player1.clickCard(this.vassalFields);
            expect(this.player2.fate).toBe(p2fate - 1);
        });

        it('Shouldn\'t use up the ability', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.p2Keeper],
                defenders: [this.p1Keeper],
                province: this.vassalFields
            });

            let p2fate = this.player2.fate;

            this.player1.clickCard(this.plains);
            expect(this.player1).toBeAbleToSelect(this.vassalFields);
            this.player1.clickCard(this.vassalFields);
            expect(this.player2.fate).toBe(p2fate - 1);

            this.player2.pass();

            this.player1.clickCard(this.vassalFields);
            expect(this.player2.fate).toBe(p2fate - 2);
        });

        it('Should be able to trigger after province has been triggered', function() {
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.p2Keeper],
                defenders: [this.p1Keeper],
                province: this.vassalFields
            });

            let p2fate = this.player2.fate;

            this.player1.clickCard(this.vassalFields);
            expect(this.player2.fate).toBe(p2fate - 1);

            this.player2.pass();

            this.player1.clickCard(this.plains);
            expect(this.player1).toBeAbleToSelect(this.vassalFields);
            this.player1.clickCard(this.vassalFields);
            expect(this.player2.fate).toBe(p2fate - 2);
            expect(this.getChatLogs(5)).toContain('player1 uses Secret Plains, bowing Secret Plains to resolve Vassal Fields\'s Make opponent lose 1 fate ability');
        });

        it('should not work not during a conflict', function() {
            this.player1.passConflict();
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.plains);
            expect(this.player1).toHavePrompt('Action Window');
        });
    });
});
