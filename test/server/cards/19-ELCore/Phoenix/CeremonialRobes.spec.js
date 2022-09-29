describe('Ceremonial Robes', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['ceremonial-robes', 'isawa-tadaka'],
                    hand: ['favored-mount'],
                    stronghold: ['city-of-the-open-hand'],
                    honor: 5
                },
                player2: {
                    inPlay: ['ceremonial-robes', 'kitsu-motso'],
                    hand: ['favored-mount'],
                    stronghold: ['isawa-mori-seido'],
                    honor: 10
                }
            });

            this.robes = this.player1.findCardByName('ceremonial-robes');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');
            this.mount = this.player1.findCardByName('favored-mount');
            this.city = this.player1.findCardByName('city-of-the-open-hand');

            this.robes2 = this.player2.findCardByName('ceremonial-robes');
            this.kitsuMotso = this.player2.findCardByName('kitsu-motso');
            this.mount2 = this.player2.findCardByName('favored-mount');
            this.ims = this.player2.findCardByName('isawa-mori-seido');

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

        it('action ability should ready your stronghold and then let you use it again and also trigger the reaction', function() {
            let glory2 = this.robes2.getGlory();
            let honor = this.player1.honor;

            this.player1.clickCard(this.city);
            this.player2.clickCard(this.ims);
            this.player2.clickCard(this.robes2);

            expect(this.player1.honor).toBe(honor + 1);
            expect(this.robes2.getGlory()).toBe(glory2 + 2);
            expect(this.city.bowed).toBe(true);
            expect(this.ims.bowed).toBe(true);

            this.player1.pass();
            this.player2.clickCard(this.robes2);
            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to ready Isawa Mori Seidō and add an additional use to each of its abilities');
            expect(this.player2).toHavePrompt('Choose a province to blank');
            expect(this.player2).toBeAbleToSelect(this.p12);
            expect(this.player2).not.toBeAbleToSelect(this.p22);
            expect(this.player2).toBeAbleToSelect(this.p32);
            expect(this.player2).toBeAbleToSelect(this.p42);
            expect(this.player2).toBeAbleToSelect(this.pStronghold2);
            expect(this.player2).not.toBeAbleToSelect(this.p1);
            expect(this.player2).not.toBeAbleToSelect(this.p2);
            expect(this.player2).not.toBeAbleToSelect(this.p3);
            expect(this.player2).not.toBeAbleToSelect(this.p4);
            expect(this.player2).not.toBeAbleToSelect(this.pStronghold);

            this.player2.clickCard(this.p12);

            expect(this.player1).toHavePrompt('Choose a province to blank');
            expect(this.player1).not.toBeAbleToSelect(this.p12);
            expect(this.player1).not.toBeAbleToSelect(this.p22);
            expect(this.player1).not.toBeAbleToSelect(this.p32);
            expect(this.player1).not.toBeAbleToSelect(this.p42);
            expect(this.player1).not.toBeAbleToSelect(this.pStronghold2);
            expect(this.player1).toBeAbleToSelect(this.p1);
            expect(this.player1).toBeAbleToSelect(this.p2);
            expect(this.player1).toBeAbleToSelect(this.p3);
            expect(this.player1).toBeAbleToSelect(this.p4);
            expect(this.player1).toBeAbleToSelect(this.pStronghold);

            this.player1.clickCard(this.p2);

            expect(this.p12.isBlank()).toBe(true);
            expect(this.p2.isBlank()).toBe(true);

            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to place a dishonored status token on Shameful Display and Shameful Display, blanking them');

            this.player1.pass();

            this.player2.clickCard(this.ims);
            this.player2.clickCard(this.robes2);
            expect(this.robes2.getGlory()).toBe(glory2 + 4);
            expect(this.ims.bowed).toBe(true);
        });

        it('action ability should be usable by both players but should only trigger the reaction once', function() {
            let glory2 = this.robes2.getGlory();
            let honor = this.player1.honor;

            this.player1.clickCard(this.city);
            this.player2.clickCard(this.ims);
            this.player2.clickCard(this.robes2);

            expect(this.player1.honor).toBe(honor + 1);
            expect(this.robes2.getGlory()).toBe(glory2 + 2);
            expect(this.city.bowed).toBe(true);
            expect(this.ims.bowed).toBe(true);

            this.player1.pass();
            this.player2.clickCard(this.robes2);
            expect(this.getChatLogs(5)).toContain('player2 uses Ceremonial Robes to ready Isawa Mori Seidō and add an additional use to each of its abilities');
            this.player2.clickCard(this.p12);
            this.player1.clickCard(this.p2);

            this.player1.clickCard(this.robes2);
            expect(this.getChatLogs(5)).toContain('player1 uses Ceremonial Robes to ready City of the Open Hand and add an additional use to each of its abilities');
            expect(this.player2).toHavePrompt('Action Window');

            this.player2.clickCard(this.ims);
            this.player2.clickCard(this.robes2);
            expect(this.robes2.getGlory()).toBe(glory2 + 4);
            expect(this.ims.bowed).toBe(true);

            expect(this.player1).toHavePrompt('Action Window');
            expect(this.city.bowed).toBe(false);
            this.player1.clickCard(this.city);
            expect(this.player1.honor).toBe(honor + 2);
            expect(this.city.bowed).toBe(true);
            expect(this.player2).toHavePrompt('Action Window');
        });
    });
});
