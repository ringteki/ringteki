describe('The Maidens Icy Grasp', function () {
    integration(function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    inPlay: [
                        'seeker-of-knowledge',
                        'fushicho',
                        'tainted-hero',
                        'ikoma-ujiaki',
                        'moto-beastmaster',
                        'miya-mystic'
                    ],
                    hand: [
                        'charge',
                        'forebearer-s-echoes',
                        'young-harrier',
                        'shosuro-miyako-2',
                        'the-maiden-s-icy-grasp',
                        'the-maiden-s-icy-grasp'
                    ],
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
            this.grasp = this.player1.filterCardsByName('the-maiden-s-icy-grasp')[0];
            this.grasp2 = this.player1.filterCardsByName('the-maiden-s-icy-grasp')[1];
            this.mystic = this.player1.findCardByName('miya-mystic');
            this.beastmaster = this.player1.findCardByName('moto-beastmaster');
            this.seekerOfKnowledge = this.player1.findCardByName('seeker-of-knowledge');
            this.fushicho = this.player1.findCardByName('fushicho');
            this.hero = this.player1.findCardByName('tainted-hero');
            this.chargeP1 = this.player1.findCardByName('charge');
            this.echoes = this.player1.findCardByName('forebearer-s-echoes');
            this.harrier = this.player1.findCardByName('young-harrier');
            this.ujina = this.player1.findCardByName('isawa-ujina');
            this.miyako = this.player1.findCardByName('shosuro-miyako-2');
            this.toturi = this.player1.placeCardInProvince('akodo-toturi', 'province 1');
            this.toturi.facedown = false;
            this.kageyu = this.player1.placeCardInProvince('daidoji-kageyu', 'province 2');
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

            this.player1.playAttachment(this.grasp, this.ujiaki);
            this.player2.pass();
            this.player1.playAttachment(this.grasp2, this.mystic);
        });

        it('should trigger when attached character is declared as an attacker', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ujiaki, this.beastmaster],
                province: this.meido
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.grasp);
            expect(this.player1).toBeAbleToSelect(this.beastmaster);
        });

        it('should not trigger when attached character is not declared as an attacker', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.beastmaster],
                province: this.meido
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).not.toBeAbleToSelect(this.grasp);
            expect(this.player1).toBeAbleToSelect(this.beastmaster);
        });

        it('should trigger when attached character is declared as a defender', function () {
            this.noMoreActions();
            this.player1.passConflict();
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.spiritcaller],
                defenders: [this.ujiaki]
            });
            expect(this.player1).toHavePrompt('Triggered Abilities');
            expect(this.player1).toBeAbleToSelect(this.grasp);
            expect(this.player1).not.toBeAbleToSelect(this.grasp2);
        });

        it('should cost 1 fate if not attached to a shugenja', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ujiaki, this.beastmaster],
                province: this.meido
            });
            let fate = this.player1.fate;
            this.player1.clickCard(this.grasp);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses The Maiden\'s Icy Grasp, bowing The Maiden\'s Icy Grasp and spending 1 fate to prevent characters from entering play this conflict'
            );
            expect(this.player1.fate).toBe(fate - 1);
        });

        it('should not cost 1 fate if attached to a shugenja', function () {
            this.noMoreActions();
            this.initiateConflict({
                type: 'military',
                attackers: [this.ujiaki, this.mystic],
                province: this.meido
            });
            let fate = this.player1.fate;
            this.player1.clickCard(this.grasp2);
            expect(this.getChatLogs(5)).toContain(
                'player1 uses The Maiden\'s Icy Grasp, bowing The Maiden\'s Icy Grasp to prevent characters from entering play this conflict'
            );
            expect(this.player1.fate).toBe(fate);
        });

        describe('Should stop characters from entering play during the conflict', function () {
            beforeEach(function () {
                this.noMoreActions();
                this.initiateConflict({
                    type: 'military',
                    attackers: [this.ujiaki],
                    province: this.meido
                });

                this.player1.clickCard(this.grasp);
                this.player2.clickPrompt('Done');
            });

            it('playing characters from discard (meido)', function () {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.challenger);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('playing characters from province (uji)', function () {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.whisperer);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('charge', function () {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.chargeP2);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('monk attachments', function () {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.wanderer);
                this.player2.clickCard(this.uji);
                expect(this.wanderer.location).toBe('play area');
                expect(this.uji.attachments.length).toBe(1);
            });

            it('echoes', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.echoes);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('spiritcaller', function () {
                expect(this.player2).toHavePrompt('Conflict Action Window');
                this.player2.clickCard(this.spiritcaller);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('fushicho', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.hero);
                this.player1.clickCard(this.fushicho);
                expect(this.player2).toHavePrompt('Conflict Action Window');
            });

            it('ujiaki', function () {
                this.kageyu.facedown = true;
                this.player1.player.imperialFavor = 'military';
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.ujiaki);
                expect(this.kageyu.facedown).toBe(false);
                expect(this.player1).not.toHavePrompt('Ikoma Ujiaki');
                expect(this.player1).not.toHavePromptButton('Done');
                expect(this.player1).not.toBeAbleToSelect(this.kageyu);
            });

            it('character from hand', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.harrier);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('disguised character from hand', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.miyako);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('disguised character from province', function () {
                this.player2.pass();
                expect(this.player1).toHavePrompt('Conflict Action Window');
                this.player1.clickCard(this.kageyu);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });
        });
    });
});
