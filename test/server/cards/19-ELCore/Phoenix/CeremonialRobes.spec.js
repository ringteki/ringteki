describe('Ceremonial Robes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ceremonial-robes', 'isawa-tadaka'],
                    hand: ['favored-mount'],
                    stronghold: ['isawa-mori-seido']
                },
                player2: {
                    inPlay: ['ceremonial-robes', 'kitsu-motso'],
                    hand: ['favored-mount'],
                    stronghold: ['isawa-mori-seido']
                }
            });

            this.robes = this.player1.findCardByName('ceremonial-robes');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.mount = this.player1.findCardByName('favored-mount');
            this.ims1 = this.player1.findCardByName('isawa-mori-seido');

            this.robes2 = this.player2.findCardByName('ceremonial-robes');
            this.kitsuMotso = this.player2.findCardByName('kitsu-motso');
            this.mount2 = this.player2.findCardByName('favored-mount');
            this.ims2 = this.player2.findCardByName('isawa-mori-seido');

            this.player1.playAttachment(this.mount, this.robes);
            this.player2.playAttachment(this.mount2, this.robes2);


            this.p1 = this.player1.findCardByName('shameful-display', 'province 1');
            this.p2 = this.player1.findCardByName('shameful-display', 'province 2');
            this.p3 = this.player1.findCardByName('shameful-display', 'province 3');
            this.p4 = this.player1.findCardByName('shameful-display', 'province 4');
            this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

            this.p12 = this.player2.findCardByName('shameful-display', 'province 1');
            this.p22 = this.player2.findCardByName('shameful-display', 'province 2');
            this.p32 = this.player2.findCardByName('shameful-display', 'province 3');
            this.p42 = this.player2.findCardByName('shameful-display', 'province 4');
            this.pStronghold2 = this.player2.findCardByName('shameful-display', 'stronghold province');


            this.p22.isBroken = true;
            this.p32.facedown = false;
        });

        it('should not react to declaration as an attacker', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.robes],
                defenders: []
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should react to declaration as a defender and force you to blank an unbroken province', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.robes],
                defenders: [this.robes2],
                province: this.p12
            });

            expect(this.player2).toHavePrompt('Choose a province to blank');
            expect(this.player2).not.toBeAbleToSelect(this.p1);
            expect(this.player2).toBeAbleToSelect(this.p12);
            expect(this.player2).not.toBeAbleToSelect(this.p2);
            expect(this.player2).not.toBeAbleToSelect(this.p22);
            expect(this.player2).not.toBeAbleToSelect(this.p3);
            expect(this.player2).toBeAbleToSelect(this.p32);
            expect(this.player2).not.toBeAbleToSelect(this.p4);
            expect(this.player2).toBeAbleToSelect(this.p42);

            this.player2.clickCard(this.p12);
            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to place a dishonored status token on Shameful Display, blanking it');
            expect(this.p12.isFaceup()).toBe(true);
            expect(this.p12.isDishonored).toBe(true);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.p12);
            expect(this.player2).toHavePrompt('Conflict Action Window');
        });

        it('should reveal if blanked province is facedown', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.robes],
                defenders: [this.robes2],
                province: this.p12
            });

            this.player2.clickCard(this.p42);
            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to place a dishonored status token on province 4, blanking it');
            expect(this.getChatLogs(5)).toContain('player2 reveals Shameful Display due to Ceremonial Robes');
            expect(this.p42.isFaceup()).toBe(true);
            expect(this.p42.isDishonored).toBe(true);
        });

        it('action ability should trigger if declared as defender, but not as attacker', function() {
            let glory1 = this.robes.getGlory();
            let glory2 = this.robes2.getGlory();

            this.player1.clickCard(this.ims1);
            this.player1.clickCard(this.robes);
            this.player2.clickCard(this.ims2);
            this.player2.clickCard(this.robes2);

            expect(this.robes.getGlory()).toBe(glory1 + 2);
            expect(this.robes2.getGlory()).toBe(glory2 + 2);
            expect(this.ims1.bowed).toBe(true);
            expect(this.ims2.bowed).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.robes],
                defenders: [this.robes2],
                province: this.p12
            });

            this.player2.clickCard(this.p42);
            this.player2.clickCard(this.robes2);
            expect(this.ims1.bowed).toBe(true);
            expect(this.ims2.bowed).toBe(false);

            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to ready Isawa Mori Seidō and add an additional use to each of its abilities');

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.robes);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.pass();

            this.player2.clickCard(this.ims2);
            this.player2.clickCard(this.robes2);
            expect(this.robes2.getGlory()).toBe(glory2 + 4);
            expect(this.ims2.bowed).toBe(true);
        });

        it('action ability should trigger if moved into conflict as defender, but not as attacker', function() {
            let glory1 = this.robes.getGlory();
            let glory2 = this.robes2.getGlory();

            this.player1.clickCard(this.ims1);
            this.player1.clickCard(this.robes);
            this.player2.clickCard(this.ims2);
            this.player2.clickCard(this.robes2);

            expect(this.robes.getGlory()).toBe(glory1 + 2);
            expect(this.robes2.getGlory()).toBe(glory2 + 2);
            expect(this.ims1.bowed).toBe(true);
            expect(this.ims2.bowed).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [this.kitsuMotso],
                province: this.p12
            });

            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.robes2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.mount2);

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.robes);
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.mount);


            this.player2.clickCard(this.robes2);
            expect(this.ims2.bowed).toBe(false);
            expect(this.player1).toHavePrompt('Conflict Action Window');

            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.robes);
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('action ability should trigger until end of phase', function() {
            this.player1.clickCard(this.ims1);
            this.player1.clickCard(this.robes);
            this.player2.clickCard(this.ims2);
            this.player2.clickCard(this.robes2);
            expect(this.ims1.bowed).toBe(true);
            expect(this.ims2.bowed).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [this.kitsuMotso],
                province: this.p12
            });

            this.isawaTadaka.bow();
            this.kitsuMotso.bow();
            this.robes.bow();
            this.robes2.bow();
            this.player2.clickCard(this.mount2);
            this.player1.clickCard(this.mount);

            this.noMoreActions();
            this.player1.pass();

            expect(this.ims2.bowed).toBe(true);
            this.player2.clickCard(this.robes2);
            expect(this.ims2.bowed).toBe(false);
        });

        it('action ability should not trigger in the next phase', function() {
            this.player1.player.promptedActionWindows.fate = true;
            this.player2.player.promptedActionWindows.fate = true;

            this.player1.clickCard(this.ims1);
            this.player1.clickCard(this.robes);
            this.player2.clickCard(this.ims2);
            this.player2.clickCard(this.robes2);
            expect(this.ims1.bowed).toBe(true);
            expect(this.ims2.bowed).toBe(true);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.isawaTadaka],
                defenders: [this.kitsuMotso],
                province: this.p12
            });

            this.isawaTadaka.bow();
            this.kitsuMotso.bow();
            this.robes.bow();
            this.robes2.bow();
            this.player2.clickCard(this.mount2);
            this.player1.clickCard(this.mount);

            this.noMoreActions();
            this.isawaTadaka.fate = 1;
            this.kitsuMotso.fate = 1;
            this.robes.fate = 1;
            this.robes2.fate = 1;

            this.advancePhases('fate');
            this.player1.pass();
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.ims2.bowed).toBe(true);
            this.player2.clickCard(this.robes2);
            expect(this.player2).toHavePrompt('Action Window');
            expect(this.ims2.bowed).toBe(true);

        });
    });
});
