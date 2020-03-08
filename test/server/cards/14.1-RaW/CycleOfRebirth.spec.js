describe('Cycle of Rebirth', function() {
    integration(function() {
        describe('Cycle of Rebirth\'s effect', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'dynasty',
                    player1: {
                        dynastyDiscard: ['akodo-zentaro', 'matsu-berserker', 'doji-whisperer', 'cycle-of-rebirth', 'akodo-toturi', 'matsu-tsuko'],
                        provinces: ['ancestral-lands', 'shameful-display', 'midnight-revels']
                    },
                    player2: {
                        dynastyDiscard: ['togashi-yokuni'],
                        provinces: ['restoration-of-balance']
                    }
                });

                this.matsuBerseker = this.player1.placeCardInProvince('matsu-berserker', 'province 1');
                this.whisperer = this.player1.moveCard('doji-whisperer', 'province 1');
                this.zentaro = this.player1.placeCardInProvince('akodo-zentaro', 'province 2');
                this.cycleOfRebirth = this.player1.placeCardInProvince('cycle-of-rebirth', 'province 3');

                this.ancestralLands = this.player1.findCardByName('ancestral-lands', 'province 1');
                this.shameful = this.player1.findCardByName('shameful-display', 'province 2');
                this.revels = this.player1.findCardByName('midnight-revels', 'province 3');

                this.restoration = this.player2.findCardByName('restoration-of-balance', 'province 1');
                this.yokuni = this.player2.placeCardInProvince('togashi-yokuni', 'province 1');
            });

            it('should allow you to pick any card in a province - facedown', function() {
                this.matsuBerseker.facedown = true,
                this.whisperer.facedown = false;

                this.player1.clickCard(this.cycleOfRebirth);

                expect(this.player1).toHavePrompt('Cycle of Rebirth');
                expect(this.player1).toBeAbleToSelect(this.matsuBerseker);
                expect(this.player1).toBeAbleToSelect(this.whisperer);
            });

            it('should allow you to pick any card in a province - enemy', function() {
                this.matsuBerseker.facedown = true,
                this.whisperer.facedown = false;

                this.player1.clickCard(this.cycleOfRebirth);

                expect(this.player1).toHavePrompt('Cycle of Rebirth');
                expect(this.player1).toBeAbleToSelect(this.yokuni);
            });

            it('should shuffle Cycle of Rebirth and targeted card back into the deck', function() {
                this.player1.clickCard(this.cycleOfRebirth);

                expect(this.player1).toHavePrompt('Cycle of Rebirth');
                this.player1.clickCard(this.zentaro);

                expect(this.zentaro.location).toBe('dynasty deck');
                expect(this.cycleOfRebirth.location).toBe('dynasty deck');
            });

            it('should refill both positions', function() {
                this.akodoToturi = this.player1.moveCard('akodo-toturi', 'dynasty deck');
                this.matsuTsuko = this.player1.moveCard('matsu-tsuko', 'dynasty deck');
                this.player1.clickCard(this.cycleOfRebirth);

                const zentaroLocation = this.zentaro.location;
                const rebirthLocation = this.cycleOfRebirth.location;
                expect(this.player1).toHavePrompt('Cycle of Rebirth');
                this.player1.clickCard(this.zentaro);

                expect(this.zentaro.location).toBe('dynasty deck');
                expect(this.cycleOfRebirth.location).toBe('dynasty deck');

                expect(this.akodoToturi.location).toBe(zentaroLocation);
                expect(this.matsuTsuko.location).toBe(rebirthLocation);
            });
        });
    });
});
