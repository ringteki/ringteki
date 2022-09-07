describe('Precocious Alchemist', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['precocious-alchemist', 'isawa-tadaka']
                },
                player2: {
                    inPlay: ['solemn-scholar', 'kitsu-motso']
                },
            });

            this.precociousAlchemist = this.player1.findCardByName('precocious-alchemist');
            this.isawaTadaka = this.player1.findCardByName('isawa-tadaka');

            this.solemnScholar = this.player2.findCardByName('solemn-scholar');
            this.kitsuMotso = this.player2.findCardByName('kitsu-motso');
        });

        it('should not work outside a conflict', function() {
            expect(this.player1).toHavePrompt('Action Window');
            this.player1.clickCard(this.precociousAlchemist);
            expect(this.player1).toHavePrompt('Action Window');
        });

        it('should not be able to trigger in a water conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.precociousAlchemist],
                defenders: [this.solemnScholar],
                type: 'military',
                ring: 'water'
            });

            this.player2.pass();
            this.player1.clickCard(this.precociousAlchemist);
            expect(this.player1).not.toHavePrompt('Choose a character');
            expect(this.player1).toHavePrompt('Conflict Action Window');
        });

        it('should be able to trigger in a fire conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.precociousAlchemist],
                defenders: [this.solemnScholar],
                type: 'military',
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.clickCard(this.precociousAlchemist);
            expect(this.player1).toHavePrompt('Choose a character');
            expect(this.player1).not.toHavePrompt('Conflict Action Window');
        });

        it('should be able to trigger in a fire conflict, choosing a participating character and give them pride', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.precociousAlchemist],
                defenders: [this.solemnScholar],
                type: 'military',
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.clickCard(this.precociousAlchemist);

            expect(this.player1).toBeAbleToSelect(this.precociousAlchemist);
            expect(this.player1).toBeAbleToSelect(this.solemnScholar);
            expect(this.player1).not.toBeAbleToSelect(this.isawaTadaka);
            expect(this.player1).not.toBeAbleToSelect(this.kitsuMotso);
            
            this.player1.clickCard(this.precociousAlchemist);
            expect(this.precociousAlchemist.hasKeyword('pride')).toBe(true);
            expect(this.getChatLogs(3)).toContain('player1 uses Precocious Alchemist to give Precocious Alchemist Pride until end of the conflict')
        });

        it('should last until the end of the conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.precociousAlchemist],
                defenders: [this.solemnScholar],
                type: 'military',
                ring: 'fire'
            });

            this.player2.pass();
            this.player1.clickCard(this.precociousAlchemist);
            this.player1.clickCard(this.precociousAlchemist);

            this.player2.pass();
            this.player1.pass();
            this.player1.clickPrompt('Don\'t resolve');
            expect(this.player1).toHavePrompt('Action Window');
            expect(this.precociousAlchemist.hasKeyword('pride')).toBe(false);
        });
    });
});
