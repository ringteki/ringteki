describe('Fields of Rolling Thunder', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'aggressive-moto',
                        'border-rider',
                        'worldly-shiotome'
                    ],
                    provinces: ['fields-of-rolling-thunder']
                }
            });

            this.fieldsOfRollingThunder = this.player1.findCardByName(
                'fields-of-rolling-thunder'
            );

            this.aggresiveMotoDishonored =
                this.player1.findCardByName('aggressive-moto');
            this.aggresiveMotoDishonored.dishonor();
            this.borderRiderOrdinary =
                this.player1.findCardByName('border-rider');
            this.worldlyShiotomeHonored =
                this.player1.findCardByName('worldly-shiotome');
            this.worldlyShiotomeHonored.honor();
        });

        describe('before you pass a conflict', function () {
            it('is not be triggerable', function () {
                this.player1.clickCard(this.fieldsOfRollingThunder);
                expect(this.player1).toHavePrompt('Initiate an action');
            });
        });

        describe('if you have passed a conflict', function () {
            it('makes ordinary the dishonored', function () {
                this.noMoreActions();
                this.player1.passConflict();

                this.player1.clickCard(this.fieldsOfRollingThunder);
                expect(this.player1).toHavePrompt('Choose a character');

                this.player1.clickCard(this.aggresiveMotoDishonored);
                expect(this.aggresiveMotoDishonored.isDishonored).toBe(false);
                expect(this.aggresiveMotoDishonored.isHonored).toBe(false);
                expect(this.getChatLogs(1)).toContain(
                    'player1 uses Fields of Rolling Thunder to honor Aggressive Moto'
                );
            });

            it('honors the hordinary', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.player1.clickCard(this.fieldsOfRollingThunder);
                expect(this.player1).toHavePrompt('Choose a character');

                this.player1.clickCard(this.borderRiderOrdinary);
                expect(this.borderRiderOrdinary.isHonored).toBe(true);
                expect(this.getChatLogs(1)).toContain(
                    'player1 uses Fields of Rolling Thunder to honor Border Rider'
                );
            });

            it('cannot be used on honored characters', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.player1.clickCard(this.fieldsOfRollingThunder);
                expect(this.player1).toHavePrompt('Choose a character');
                expect(this.player1).not.toBeAbleToSelect(
                    this.worldlyShiotomeHonored
                );
            });
        });
    });
});
