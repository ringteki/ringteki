describe('Liaison to the Ancestors', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['liaison-to-the-ancestors', 'honored-general', 'akodo-toturi'],
                    hand: ['resourcefulness'],
                    dynastyDiscard: ['ikoma-ujiaki']
                },
                player2: {
                    inPlay: ['bayushi-dairu'],
                    hand: ['way-of-the-scorpion', 'unspoken-etiquette']
                }
            });

            this.liaisonToTheAncestors = this.player1.findCardByName('liaison-to-the-ancestors');
            this.toturi = this.player1.findCardByName('akodo-toturi');
            this.honoredGeneral = this.player1.findCardByName('honored-general');
            this.ujiaki = this.player1.findCardByName('ikoma-ujiaki');
            this.resourcefulness = this.player1.findCardByName('resourcefulness');

            this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            this.dairu = this.player2.findCardByName('bayushi-dairu');
            this.unspokenEtiquette = this.player2.findCardByName('unspoken-etiquette');
        });

        it('works on multiple characters at the same time', function () {
            this.toturi.honor();

            this.noMoreActions();
            this.initiateConflict({
                type: 'political',
                attackers: [this.toturi, this.honoredGeneral, this.liaisonToTheAncestors],
                defenders: []
            });

            this.player2.clickCard(this.unspokenEtiquette);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.liaisonToTheAncestors);

            this.player1.clickCard(this.liaisonToTheAncestors);

            expect(this.player1).toHavePrompt('Select a card to affect');
            this.player1.clickCard(this.honoredGeneral);
            expect(this.honoredGeneral.isHonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Liaison to the Ancestors to honor Honored General');
        });

        it('rehonor character with lower cost', function () {
            this.toturi.honor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.honoredGeneral],
                defenders: []
            });

            this.player2.clickCard(this.scorp);
            this.player2.clickCard(this.honoredGeneral);
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.liaisonToTheAncestors);

            this.player1.clickCard(this.liaisonToTheAncestors);
            expect(this.honoredGeneral.isHonored).toBe(false);
            expect(this.scorp.location).toBe('conflict discard pile');
            expect(this.getChatLogs(5)).toContain('player1 uses Liaison to the Ancestors to honor Honored General');
        });

        it('does not rehonor character with higher cost', function () {
            this.toturi.honor();

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.toturi, this.honoredGeneral],
                defenders: []
            });

            this.player2.clickCard(this.scorp);
            this.player2.clickCard(this.toturi);
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.liaisonToTheAncestors);
        });

        it('should cancel dishonoring via fire ring', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.dairu],
                defenders: [],
                ring: 'fire'
            });

            this.noMoreActions();

            this.player2.clickCard(this.honoredGeneral);
            this.player2.clickPrompt('Dishonor Honored General');

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.liaisonToTheAncestors);

            this.player1.clickCard(this.liaisonToTheAncestors);
            expect(this.honoredGeneral.isHonored).toBe(false);
            expect(this.getChatLogs(5)).toContain('player1 uses Liaison to the Ancestors to honor Honored General');
        });
    });
});