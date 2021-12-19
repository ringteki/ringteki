describe('Bake Kujira', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['bake-kujira', 'doji-diplomat', 'doji-whisperer'],
                    hand: ['unleash-the-djinn', 'command-the-tributary'],
                    dynastyDiscard: ['funeral-pyre', 'iron-mine']
                },
                player2: {
                    inPlay: ['doji-kuwanan', 'doji-fumiki', 'daidoji-uji'],
                    hand: ['way-of-the-scorpion', 'charge', 'forebearer-s-echoes', 'reprieve'],
                    dynastyDiscard: ['bake-kujira', 'doji-challenger']
                }
            });

            this.whale = this.player1.findCardByName('bake-kujira');
            this.diplomat = this.player1.findCardByName('doji-diplomat');
            this.whisperer = this.player1.findCardByName('doji-whisperer');
            this.command = this.player1.findCardByName('command-the-tributary');
            this.pyre = this.player1.placeCardInProvince('funeral-pyre', 'province 1');
            this.mine = this.player1.findCardByName('iron-mine');
            this.djinn = this.player1.findCardByName('unleash-the-djinn');

            this.kuwanan = this.player2.findCardByName('doji-kuwanan');
            this.fumiki = this.player2.findCardByName('doji-fumiki');
            this.challenger = this.player2.findCardByName('doji-challenger');

            this.scorp = this.player2.findCardByName('way-of-the-scorpion');
            this.charge = this.player2.findCardByName('charge');
            this.echoes = this.player2.findCardByName('forebearer-s-echoes');

            this.whale2 = this.player2.findCardByName('bake-kujira');
            this.uji = this.player2.findCardByName('daidoji-uji');
            this.reprieve = this.player2.findCardByName('reprieve');

            this.diplomat.fate = 5;
            this.player1.playAttachment(this.command, this.diplomat);
        });

        it('should be immune to events and not able to be put into play', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan]
            });

            this.player2.clickCard(this.scorp);
            expect(this.player2).toBeAbleToSelect(this.kuwanan);
            expect(this.player2).not.toBeAbleToSelect(this.whale);
            this.player2.clickCard(this.kuwanan);

            let mil = this.whale.getMilitarySkill();
            this.player1.clickCard(this.djinn);
            expect(this.whale.getMilitarySkill()).toBe(mil);

            this.player2.clickCard(this.echoes);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.whale2);

            this.player2.clickPrompt('Cancel');

            this.player2.placeCardInProvince(this.whale2, 'province 1');
            this.player2.placeCardInProvince(this.challenger, 'province 2');

            this.game.checkGameState(true);

            this.player2.clickCard(this.charge);
            expect(this.player2).toBeAbleToSelect(this.challenger);
            expect(this.player2).not.toBeAbleToSelect(this.whale2);

            this.player2.clickPrompt('Cancel');

            this.uji.honor();
            this.game.checkGameState(true);
            this.player2.clickCard(this.whale2);
            expect(this.player2).toHavePrompt('Conflict Action Window');
            this.player2.clickCard(this.challenger);
            expect(this.player2).toHavePrompt('Choose additional fate');
        });

        it('should eat people and remove from the game when it leaves - dynasty', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan]
            });

            this.player2.pass();

            let mil = this.whale.getMilitarySkill();

            this.player1.clickCard(this.whale);
            expect(this.player1).not.toBeAbleToSelect(this.fumiki);
            expect(this.player1).not.toBeAbleToSelect(this.whale);
            expect(this.player1).toBeAbleToSelect(this.kuwanan);
            this.player1.clickCard(this.kuwanan);
            expect(this.whale.getMilitarySkill()).toBe(mil + 2);
            expect(this.kuwanan.location).toBe(this.whale.uuid);

            expect(this.getChatLogs(5)).toContain('player1 uses Bake-Kujira to swallow Doji Kuwanan whole!');

            this.player2.pass();
            this.player1.clickCard(this.pyre);
            this.player1.clickCard(this.whale);
            expect(this.kuwanan.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Doji Kuwanan is removed from the game due to Bake-Kujira leaving play');
        });

        it('should eat people and remove them from the game when it leaves - conflict', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.fumiki]
            });

            this.player2.pass();

            let mil = this.whale.getMilitarySkill();

            this.player1.clickCard(this.whale);
            this.player1.clickCard(this.fumiki);
            expect(this.whale.getMilitarySkill()).toBe(mil + 2);
            expect(this.fumiki.location).toBe(this.whale.uuid);

            expect(this.getChatLogs(5)).toContain('player1 uses Bake-Kujira to swallow Doji Fumiki whole!');

            this.player2.pass();
            this.player1.clickCard(this.pyre);
            this.player1.clickCard(this.whale);
            expect(this.fumiki.location).toBe('removed from game');
            expect(this.getChatLogs(5)).toContain('Doji Fumiki is removed from the game due to Bake-Kujira leaving play');
        });

        it('should not allow reprieve to save the target', function() {
            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan]
            });

            this.player2.playAttachment(this.reprieve, this.kuwanan);
            this.player1.clickCard(this.whale);
            this.player1.clickCard(this.kuwanan);
            expect(this.kuwanan.location).toBe(this.whale.uuid);
            expect(this.getChatLogs(5)).toContain('player1 uses Bake-Kujira to swallow Doji Kuwanan whole!');
        });

        it('should not be able to be saved', function() {
            this.player2.moveCard(this.whale2, 'play area');
            this.player1.placeCardInProvince(this.mine, 'province 2');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale],
                defenders: [this.kuwanan, this.whale2]
            });

            let mil = this.whale2.getMilitarySkill();

            this.player2.clickCard(this.whale2);
            this.player2.clickCard(this.whale);

            expect(this.whale2.getMilitarySkill()).toBe(mil + 2);
            expect(this.whale.location).toBe(this.whale2.uuid);

            expect(this.getChatLogs(5)).toContain('player2 uses Bake-Kujira to swallow Bake-Kujira whole!');
        });

        it('should not be able to be saved - testing setup', function() {
            this.player2.moveCard(this.whale2, 'play area');
            this.player1.placeCardInProvince(this.mine, 'province 2');

            this.noMoreActions();
            this.initiateConflict({
                attackers: [this.whale, this.diplomat],
                defenders: [this.kuwanan, this.whale2]
            });

            this.player2.clickCard(this.whale2);
            this.player2.clickCard(this.diplomat);

            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.mine);
        });

        it('should not be able to put fate on it', function() {
            this.player2.pass();
            this.player1.clickCard(this.diplomat);
            expect(this.player1).not.toBeAbleToSelect(this.diplomat);
            expect(this.player1).not.toBeAbleToSelect(this.whale);
            expect(this.player1).toBeAbleToSelect(this.whisperer);

            this.player1.clickCard(this.whisperer);
            expect(this.whisperer.fate).toBe(1);
        });
    });
});

describe('Bake Kujira - Dynasty', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'dynasty',
                player1: {
                    dynastyDiscard: ['bake-kujira', 'bake-kujira'],
                    provinces: ['tsuma', 'toshi-ranbo', 'manicured-garden'],
                    fate: 20
                },
                player2: {
                }
            });

            this.whale = this.player1.filterCardsByName('bake-kujira')[0];
            this.whale2 = this.player1.filterCardsByName('bake-kujira')[1];
            this.tsuma = this.player1.findCardByName('tsuma');
            this.ranbo = this.player1.findCardByName('toshi-ranbo');

            this.player1.placeCardInProvince(this.whale, this.tsuma.location);
            this.player1.placeCardInProvince(this.whale2, this.ranbo.location);
        });

        it('should not prompt you to add fate, but enter play with 1 fate', function() {
            this.player1.clickCard(this.whale);
            expect(this.player1).toHavePromptButton('0');
            expect(this.player1).not.toHavePromptButton('1');
            expect(this.player1).not.toHavePromptButton('2');
            this.player1.clickPrompt('0');
            expect(this.whale.location).toBe('play area');
            expect(this.whale.isHonored).toBe(true);
            expect(this.whale.fate).toBe(1);
        });

        it('should not be able to dupe for fate', function() {
            this.player1.clickCard(this.whale);
            this.player1.clickPrompt('0');
            expect(this.whale.fate).toBe(1);
            this.player2.pass();
            this.player1.clickCard(this.whale2);
            expect(this.whale.fate).toBe(1);
            expect(this.whale2.location).toBe(this.ranbo.location);
        });

        it('should not gain fate from Toshi Ranbo', function() {
            this.player1.clickCard(this.whale2);
            this.player1.clickPrompt('0');
            expect(this.whale2.fate).toBe(1);
        });
    });
});
