describe('Skirmish Provinces', function() {
    integration(function() {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['doji-whisperer', 'shinjo-trailblazer', 'kakita-yoshi-2'],
                    hand: ['iuchi-wayfinder']
                },
                player2: {
                    inPlay: ['garanto-guardian'],
                    hand: ['mirumoto-s-fury']
                },
                skirmish: true
            });

            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.wayfinder = this.player1.findCardByName('iuchi-wayfinder');
            this.trailblazer = this.player1.findCardByName('shinjo-trailblazer');
            this.guardian = this.player2.findCardByName('garanto-guardian');
            this.province = this.player2.findCardByName('skirmish-province', 'province 1');
        });

        it('Should not reveal when attacked', function () {
            this.province.facedown = true;
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                province: this.province
            });
            expect(this.player1).not.toHavePrompt('Triggered Abilities');
            expect(this.player2).toHavePrompt('Choose Defenders');
        });

        it('Should have 3 strength', function () {
            this.noMoreActions();

            this.initiateConflict({
                type: 'political',
                attackers: [this.whisperer],
                defenders: [],
                province: this.province
            });
            expect(this.province.isBroken).toBe(false);
            this.noMoreActions();
            this.player1.clickPrompt('No');
            this.player1.clickPrompt('Don\'t Resolve');
            expect(this.province.isBroken).toBe(true);
        });

        it('Should have no elements', function () {
            this.noMoreActions();

            this.initiateConflict({
                type: 'military',
                attackers: [this.whisperer],
                defenders: [this.guardian],
                province: this.province
            });

            this.noMoreActions();
            expect(this.player2).not.toHavePrompt('Triggered Abilities');
            expect(this.player1).toHavePrompt('Action Window');

        });

        it('No provinces should be face down - cannot target a facedown province', function () {
            this.player1.clickCard(this.wayfinder);
            this.player1.clickPrompt('0');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('No provinces should be face down - cannot target a facedown province', function () {
            this.player1.clickCard(this.wayfinder);
            this.player1.clickPrompt('0');
            expect(this.player2).toHavePrompt('Action Window');
        });

        it('Should not be able to move cards to province 4', function () {

        });

        it('Province 4 should not have a card in it', function () {
            expect(this.player1.player.getDynastyCardsInProvince('province 4').length).toBe(0);
        });
    });
});

describe('Skirmish Province - should not be able to move cards to stronghold province', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    inPlay: ['naive-student'],
                    dynastyDiscard: ['bustling-academy','kanjo-district', 'recalled-defenses']
                },
                player2: {
                    inPlay: ['moto-youth','shinjo-scout'],
                    dynastyDiscard:['shiotome-encampment'],
                    hand: []
                },
                skirmish: true
            });

            this.ba = this.player1.placeCardInProvince('bustling-academy','province 1');
            this.kd = this.player1.placeCardInProvince('kanjo-district','province 2');
            this.naive = this.player1.findCardByName('naive-student');
            this.defenses = this.player1.placeCardInProvince('recalled-defenses', 'province 3');
            this.player1.moveCard(this.naive, 'province 1');

            this.shio = this.player2.placeCardInProvince('shiotome-encampment','province 1');
            this.youth = this.player2.placeCardInProvince('moto-youth','province 2');
            this.scout = this.player2.findCardByName('shinjo-scout');
        });

        it('recalled defenses should not work', function() {
            this.player1.clickCard(this.defenses);
            expect(this.player1).not.toHavePrompt('Choose a card');
        });
    });
});
