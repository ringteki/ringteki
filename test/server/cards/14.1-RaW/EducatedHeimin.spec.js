describe('Educated Heimin', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [],
                    fate: 20,
                    hand: ['educated-heimin'],
                    dynastyDiscard: ['akodo-zentaro', 'matsu-berserker', 'doji-whisperer', 'moto-chagatai', 'samurai-of-integrity', 'akodo-toturi'],
                    inPlay: ['doji-kuwanan'],
                    provinces: ['manicured-garden', 'city-of-the-rich-frog', 'kakudaira']
                },
                player2: {
                    inPlay: ['naive-student'],
                    dynastyDiscard: ['bustling-academy'],
                    hand: ['sabotage']
                }
            });

            this.matsuBerseker = this.player1.placeCardInProvince('matsu-berserker', 'province 2');
            this.whisperer = this.player1.placeCardInProvince('doji-whisperer', 'province 1');
            this.zentaro = this.player1.findCardByName('akodo-zentaro');
            this.chagatai = this.player1.findCardByName('moto-chagatai');
            this.samuraiOfIntegrity = this.player1.findCardByName('samurai-of-integrity');
            this.akodoToturi = this.player1.findCardByName('akodo-toturi');
            this.kuwanan = this.player1.findCardByName('doji-kuwanan');
            this.heimin = this.player1.findCardByName('educated-heimin');

            this.academy = this.player2.findCardByName('bustling-academy');
            this.player2.findCardByName('sabotage');

            this.garden = this.player1.findCardByName('manicured-garden');
            this.frog = this.player1.findCardByName('city-of-the-rich-frog');
            this.eminient = this.player1.findCardByName('kakudaira');

            this.player2.placeCardInProvince(this.academy, 'province 1');
        });

        // it('should be able to played on a province', function() {
        //     this.player1.playAttachment(this.heimin, this.garden);
        //     expect(this.heimin.parent).toBe(this.garden);
        // });

        // it('should let you pick cards to refill (province is facedown) and work with refill faceup effects', function() {
        //     this.player1.placeCardInProvince(this.kuwanan, this.garden.location);
        //     this.player1.playAttachment(this.heimin, this.garden);

        //     this.player1.reduceDeckToNumber('dynasty deck', 0);
        //     this.player1.moveCard(this.matsuBerseker, 'dynasty deck');
        //     this.player1.moveCard(this.whisperer, 'dynasty deck');
        //     this.player1.moveCard(this.zentaro, 'dynasty deck');
        //     this.player1.moveCard(this.chagatai, 'dynasty deck');
        //     this.player1.moveCard(this.samuraiOfIntegrity, 'dynasty deck');
        //     this.player1.moveCard(this.akodoToturi, 'dynasty deck');

        //     this.player2.clickCard(this.academy);
        //     this.player2.clickCard(this.kuwanan);

        //     expect(this.player1).toHavePrompt('Choose a card to refill the province with');
        //     expect(this.player1).toHavePromptButton('Akodo Toturi');
        //     expect(this.player1).toHavePromptButton('Samurai of Integrity');
        //     expect(this.player1).toHavePromptButton('Moto Chagatai');
        //     expect(this.player1).toHavePromptButton('Akodo Zentarō');

        //     this.player1.clickPrompt('Moto Chagatai');
        //     expect(this.chagatai.location).toBe(this.garden.location);
        //     expect(this.chagatai.facedown).toBe(false);
        //     expect(this.getChatLogs(1)).toContain('player1 chooses a card to put into a facedown province and discards Akodo Toturi, Samurai of Integrity and Akodo Zentarō from the constant effect of Educated Heimin');
        //     expect(this.akodoToturi.location).toBe('dynasty discard pile');
        //     expect(this.samuraiOfIntegrity.location).toBe('dynasty discard pile');
        //     expect(this.zentaro.location).toBe('dynasty discard pile');
        //     expect(this.player1).toHavePrompt('Action Window');
        // });

        // it('should let you pick cards to refill (province is faceup) and work with refill faceup effects', function() {
        //     this.player1.placeCardInProvince(this.kuwanan, this.eminient.location);
        //     this.player1.playAttachment(this.heimin, this.eminient);

        //     this.player1.reduceDeckToNumber('dynasty deck', 0);
        //     this.player1.moveCard(this.matsuBerseker, 'dynasty deck');
        //     this.player1.moveCard(this.whisperer, 'dynasty deck');
        //     this.player1.moveCard(this.zentaro, 'dynasty deck');
        //     this.player1.moveCard(this.chagatai, 'dynasty deck');
        //     this.player1.moveCard(this.samuraiOfIntegrity, 'dynasty deck');
        //     this.player1.moveCard(this.akodoToturi, 'dynasty deck');

        //     this.player2.clickCard(this.academy);
        //     this.player2.clickCard(this.kuwanan);

        //     expect(this.player1).toHavePrompt('Choose a card to refill the province with');
        //     expect(this.player1).toHavePromptButton('Akodo Toturi');
        //     expect(this.player1).toHavePromptButton('Samurai of Integrity');
        //     expect(this.player1).not.toHavePromptButton('Moto Chagatai');
        //     expect(this.player1).not.toHavePromptButton('Akodo Zentarō');

        //     this.player1.clickPrompt('Akodo Toturi');
        //     expect(this.akodoToturi.location).toBe(this.eminient.location);
        //     expect(this.akodoToturi.facedown).toBe(false);
        //     expect(this.getChatLogs(1)).toContain('player1 chooses a card to put into Kakudaira and discards Samurai of Integrity from the constant effect of Educated Heimin');
        //     expect(this.samuraiOfIntegrity.location).toBe('dynasty discard pile');
        // });

        it('should let you pick cards to refill (rich frog)', function() {
            this.player1.placeCardInProvince(this.kuwanan, this.frog.location);
            this.player1.playAttachment(this.heimin, this.frog);

            this.player1.reduceDeckToNumber('dynasty deck', 0);
            this.player1.moveCard(this.matsuBerseker, 'dynasty deck');
            this.player1.moveCard(this.whisperer, 'dynasty deck');
            this.player1.moveCard(this.zentaro, 'dynasty deck');
            this.player1.moveCard(this.chagatai, 'dynasty deck');
            this.player1.moveCard(this.samuraiOfIntegrity, 'dynasty deck');
            this.player1.moveCard(this.akodoToturi, 'dynasty deck');

            this.player2.clickCard(this.academy);
            this.player2.clickCard(this.kuwanan);

            expect(this.player1).toHavePrompt('Choose a card to refill the province with');
            expect(this.player1).toHavePromptButton('Akodo Toturi');
            expect(this.player1).toHavePromptButton('Samurai of Integrity');
            expect(this.player1).not.toHavePromptButton('Moto Chagatai');
            expect(this.player1).not.toHavePromptButton('Akodo Zentarō');

            this.player1.clickPrompt('Akodo Toturi');
            expect(this.akodoToturi.location).toBe(this.frog.location);
            expect(this.getChatLogs(1)).toContain('player1 chooses a card to put into City of the Rich Frog and discards Samurai of Integrity from the constant effect of Educated Heimin');
            expect(this.samuraiOfIntegrity.location).toBe('dynasty discard pile');

            expect(this.player1).toHavePrompt('Choose a card to refill the province with');
            expect(this.player1).toHavePromptButton('Moto Chagatai');
            expect(this.player1).toHavePromptButton('Akodo Zentarō');
            this.player1.clickCard(this.chagatai);
            expect(this.chagatai.location).toBe(this.frog.location);
            expect(this.getChatLogs(1)).toContain('player1 chooses a card to put into City of the Rich Frog and discards Akodo Zentarō from the constant effect of Educated Heimin');
            expect(this.zentaro.location).toBe('dynasty discard pile');
        });

        // it('should discard when the attached province is broken', function() {
        //     this.player1.clickCard(this.preparedAmbush);
        //     expect(this.player1).toBeAbleToSelect(this.ancestralLands);
        //     expect(this.player1).toBeAbleToSelect(this.garden);
        //     this.player1.clickCard(this.ancestralLands);

        //     this.noMoreActions();

        //     this.initiateConflict({
        //         attackers: [this.zentaro, this.chagatai],
        //         defenders: [],
        //         province: this.ancestralLands
        //     });

        //     this.noMoreActions();
        //     this.player1.clickPrompt('No');
        //     this.player1.clickPrompt('Don\'t Resolve');
        //     expect(this.preparedAmbush.location).toBe('conflict discard pile');
        //     expect(this.getChatLogs(10)).toContain('Prepared Ambush is discarded from Ancestral Lands as it is no longer legally attached');
        // });
    });
});
