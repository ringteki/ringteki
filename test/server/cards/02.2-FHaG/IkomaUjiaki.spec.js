describe('Ikoma Ujiaki', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: ['expert-interpreter', 'seeker-of-knowledge', 'fushicho', 'tainted-hero', 'ikoma-ujiaki'],
                    hand: ['charge', 'forebearer-s-echoes', 'young-harrier', 'shosuro-miyako-2'],
                    dynastyDiscard: ['isawa-ujina', 'akodo-toturi', 'daidoji-kageyu']
                },
                player2: {
                    honor: 11,
                    inPlay: ['daidoji-uji', 'kitsu-spiritcaller'],
                    hand: ['charge', 'tattooed-wanderer'],
                    dynastyDiscard: ['doji-challenger', 'doji-whisperer'],
                    provinces: ['gateway-to-meido']
                }
            });
            this.interpreter = this.player1.findCardByName('expert-interpreter');
            this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
            this.fushicho = this.player1.placeCardInProvince('fushicho', 'province 4');
            this.hero = this.player1.findCardByName('tainted-hero');
            this.chargeP1 = this.player1.findCardByName('charge');
            this.echoes = this.player1.findCardByName('forebearer-s-echoes');
            this.harrier = this.player1.findCardByName('young-harrier');
            this.ujina = this.player1.placeCardInProvince('isawa-ujina', 'province 3');
            this.miyako = this.player1.findCardByName('shosuro-miyako-2');
            this.toturi = this.player1.placeCardInProvince('akodo-toturi', 'province 1');
            this.kageyu = this.player1.placeCardInProvince('daidoji-kageyu', 'province 2');

            this.ujina.facedown = false;
            this.fushicho.facedown = false;
            this.toturi.facedown = false;
            this.kageyu.facedown = false;
            this.ujiaki = this.player1.findCardByName('ikoma-ujiaki');

            this.uji = this.player2.findCardByName('daidoji-uji');
            this.spiritcaller = this.player2.findCardByName('kitsu-spiritcaller');
            this.chargeP2 = this.player2.findCardByName('charge');
            this.wanderer = this.player2.findCardByName('tattooed-wanderer');
            this.challenger = this.player2.findCardByName('doji-challenger');
            this.whisperer = this.player2.placeCardInProvince('doji-whisperer', 'province 1');
            this.whisperer.facedown = false;
            this.meido = this.player2.findCardByName('gateway-to-meido');
            this.uji.honor();

            this.noMoreActions();

            this.initiateConflict({
                ring: 'fire',
                type: 'military',
                attackers: [this.interpreter, this.ujiaki],
                defenders: [],
                province: this.meido
            });
        });

        it('should work without any facedown', function() {
            this.player1.player.imperialFavor = 'military';
            this.player2.pass();
            expect(this.player1).toHavePrompt('Conflict Action Window');
            this.player1.clickCard(this.ujiaki);
            expect(this.kageyu.facedown).toBe(false);
            expect(this.player1).toHavePrompt('Ikoma Ujiaki');
            expect(this.player1).toHavePromptButton('Done');
            expect(this.player1).toBeAbleToSelect(this.kageyu);
            this.player1.clickCard(this.kageyu);
            this.player1.clickPrompt('Done');
        });
    });
});
