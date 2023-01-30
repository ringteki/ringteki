describe('Village Doshin', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['master-of-the-blade'],
                    hand: [
                        'fine-katana',
                        'dragon-s-fang',
                        'dragon-s-claw',
                        'village-doshin'
                    ]
                },
                player2: {
                    provinces: ['blood-of-onnotangu'],
                    hand: ['let-go', 'disarm']
                }
            });

            this.masterOfTheBlade = this.player1.findCardByName(
                'master-of-the-blade'
            );

            this.dragonsClaw = this.player1.findCardByName('dragon-s-claw');
            this.dragonsFang = this.player1.findCardByName('dragon-s-fang');
            this.fineKatana = this.player1.findCardByName('fine-katana');
            this.villageDoshin = this.player1.findCardByName('village-doshin');

            this.letGo = this.player2.findCardByName('let-go');
            this.disarm = this.player2.findCardByName('disarm');
            this.bloodOfOnnotangu = this.player2.findCardByName(
                'blood-of-onnotangu',
                'province 1'
            );
        });

        it('should trigger when an attachment is target', function () {
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.fineKatana);

            expect(this.player1).toHavePrompt('Triggered Abilities');
        });

        it('saves the attachment if the opponent refuses to pay the added cost', function () {
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.fineKatana);

            this.player1.clickCard(this.villageDoshin);
            expect(this.player2).toHavePrompt('Select one');
            expect(this.player2).toHavePromptButton('Pay 1 fate to continue');
            expect(this.player2).toHavePromptButton(
                'Do not pay, let the attachment stay'
            );

            this.player2.clickPrompt('Do not pay, let the attachment stay');
            expect(this.villageDoshin.location).toBe('removed from game');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.fineKatana.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Village Dōshin, discarding Village Dōshin to protect Fine Katana'
            );
            expect(this.getChatLogs(5)).toContain(
                'player2 refuses to pay. The attachment stays in play'
            );
        });

        it('saves the attachment if the opponent does not have fate to pay the added cost', function () {
            this.player2.fate = 0;

            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.fineKatana);

            this.player1.clickCard(this.villageDoshin);
            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.villageDoshin.location).toBe('removed from game');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.fineKatana.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Village Dōshin, discarding Village Dōshin to protect Fine Katana'
            );
        });

        it('saves the attachment if the opponent cannot pay the added cost', function () {
            this.player1.clickCard(this.fineKatana);
            this.player1.clickCard(this.masterOfTheBlade);

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.masterOfTheBlade],
                defenders: [],
                province: this.bloodOfOnnotangu
            });

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.fineKatana);

            this.player1.clickCard(this.villageDoshin);
            expect(this.player2.fate).toBeGreaterThanOrEqual(1);
            expect(this.player2).not.toHavePrompt('Select one');
            expect(this.villageDoshin.location).toBe('removed from game');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.fineKatana.location).toBe('play area');
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Village Dōshin, discarding Village Dōshin to protect Fine Katana'
            );
        });

        it('does not save the attachment if the opponent pays the added cost', function () {
            let player2InitialFate = this.player2.fate;
            this.player1.clickCard(this.dragonsClaw);
            this.player1.clickCard(this.masterOfTheBlade);

            this.player2.clickCard(this.letGo);
            this.player2.clickCard(this.dragonsClaw);

            this.player1.clickCard(this.villageDoshin);
            expect(this.player2).toHavePrompt('Select one');
            expect(this.player2).toHavePromptButton('Pay 2 fate to continue');
            expect(this.player2).toHavePromptButton(
                'Do not pay, let the attachment stay'
            );

            this.player2.clickPrompt('Pay 2 fate to continue');
            expect(this.villageDoshin.location).toBe('conflict discard pile');
            expect(this.letGo.location).toBe('conflict discard pile');
            expect(this.dragonsClaw.location).toBe('conflict discard pile');
            expect(this.player2.fate).toBe(player2InitialFate - 2);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses Village Dōshin, discarding Village Dōshin to protect Dragon\'s Claw'
            );
            expect(this.getChatLogs(5)).toContain(
                'player2 pays off the Dōshin. The action continues as normal'
            );
        });
    });
});
