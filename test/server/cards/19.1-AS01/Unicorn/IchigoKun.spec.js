describe('Ichigo-kun', function () {
    integration(function () {
        describe('Ichigo-kun cannot be evaded', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['shameful-display']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');

                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
            });

            it('should not be able to be evaded by covert', function () {
                this.noMoreActions();
                this.player1.passConflict();

                this.noMoreActions();
                expect(this.player2).toHavePrompt('initiate conflict');
                this.player2.clickCard(this.ikehata);
                this.player2.clickRing('air');
                this.player2.clickCard(this.shamefulDisplay1);

                expect(this.player2).toHavePromptButton('Initiate Conflict');
                this.player2.clickPrompt('Initiate Conflict');

                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player1.clickCard(this.ichigoKun);
                expect(this.player2).toHavePrompt('Choose covert target for Ikoma Ikehata');
                expect(this.ichigoKun.covert).toBe(false);
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(true);
                expect(this.ikehata.isAttacking()).toBe(true);
            });
        });

        describe('Ichigo-kun during fire conflicts', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'shika-matchmaker'],
                        provinces: ['manicured-garden']
                    },
                    player2: {
                        inPlay: ['ikoma-ikehata'],
                        hand: ['elemental-inversion'],
                        provinces: ['shameful-display']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.matchmaker = this.player1.findCardByName('shika-matchmaker');
                this.manicuredGarden = this.player1.findCardByName('manicured-garden', 'province 1');

                this.shamefulDisplay1 = this.player2.findCardByName('shameful-display', 'province 1');
                this.ikehata = this.player2.findCardByName('ikoma-ikehata');
                this.elementalInversion = this.player2.findCardByName('elemental-inversion');
            });

            it('cannot be declared as an attacker', function () {
                this.noMoreActions();

                expect(this.player1).toHavePrompt('initiate conflict');

                this.player1.clickCard(this.shamefulDisplay1);
                this.player1.clickRing('fire');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isAttacking()).toBe(false);
                expect(this.game.currentConflict.element).toBe('fire');
                expect(this.game.currentConflict.attackers).not.toContain(this.ichigoKun);
            });

            it('cannot be declared as a defender', function () {
                this.noMoreActions();
                this.player1.passConflict();
                this.noMoreActions();

                expect(this.player2).toHavePrompt('initiate conflict');

                this.player2.clickCard(this.manicuredGarden);
                this.player2.clickRing('fire');
                this.player2.clickCard(this.ikehata);
                this.player2.clickPrompt('Initiate Conflict');
                this.player2.clickPrompt('No Target');

                expect(this.player1).toHavePrompt('Choose defenders');
                this.player1.clickCard(this.ichigoKun);
                expect(this.ichigoKun.isDefending()).toBe(false);
                expect(this.game.currentConflict.defenders).not.toContain(this.ichigoKun);
            });

            it('cannot participate should the ring become fire', function () {
                this.noMoreActions();

                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: []
                });

                this.player2.clickCard(this.elementalInversion);
                this.player2.clickRing('fire');

                expect(this.getChatLogs(3)).toContain(
                    'Ichigo-kun cannot participate in the conflict any more and is sent home bowed'
                );
            });
        });

        describe('Ichigo-kun interaction with discarding cards from hand', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['ichigo-kun', 'merchant-of-curiosities'],
                        hand: ['spoils-of-war', 'ornate-fan']
                    },
                    player2: {
                        inPlay: ['master-whisperer', 'keeper-initiate'],
                        hand: ['ambush']
                    }
                });

                this.ichigoKun = this.player1.findCardByName('ichigo-kun');
                this.merchantOfCuriosities = this.player1.findCardByName('merchant-of-curiosities');
                this.spoilsOfWar = this.player1.findCardByName('spoils-of-war');

                this.ornateFan = this.player1.findCardByName('ornate-fan');

                this.masterWhisperer = this.player2.findCardByName('master-whisperer');
                this.keeperInitiate = this.player2.findCardByName('keeper-initiate');
                this.ambush = this.player2.findCardByName('ambush');

                this.noMoreActions();
            });

            it('while not participating does not captures own cards from player effects', function () {
                this.player1.moveCard(this.ornateFan, 'conflict deck');

                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.merchantOfCuriosities],
                    defenders: [this.keeperInitiate]
                });
                this.noMoreActions();

                this.player1.clickCard(this.spoilsOfWar);
                this.player1.clickCard(this.ornateFan);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
            });

            it('while not participating captures cards from costs', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.merchantOfCuriosities],
                    defenders: [this.keeperInitiate]
                });

                this.player2.pass();
                this.player1.clickCard(this.merchantOfCuriosities);
                this.player1.clickCard(this.ornateFan);
                this.player2.clickPrompt('Yes');
                this.player2.clickCard(this.ambush);

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
            });

            it('while not participating captures own cards from opponent effects', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.merchantOfCuriosities],
                    defenders: [this.keeperInitiate]
                });

                this.player2.clickCard(this.masterWhisperer);
                this.player2.clickPrompt('player1');

                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
            });

            it('while not participating does not capture cards from ring effects', function () {
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.merchantOfCuriosities],
                    defenders: [this.keeperInitiate]
                });

                this.noMoreActions();

                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickPrompt('Pass');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
                expect(this.player1).toHavePrompt('Choose an effect to resolve');
                this.player1.clickPrompt('Draw a card and opponent discards');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
            });

            it('while participating captures own cards from player effects', function () {
                this.player1.moveCard(this.ornateFan, 'conflict deck');

                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.keeperInitiate]
                });
                this.noMoreActions();

                this.player1.clickCard(this.spoilsOfWar);
                this.player1.clickCard(this.ornateFan);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Ornate Fan underneath Ichigo-kun instead of letting them be discarded and place 1 fate on Ichigo-kun - tasty!'
                );
                expect(this.ornateFan.location).toBe(this.ichigoKun.uuid);
                expect(this.ichigoKun.getMilitarySkill()).toBe(3 + 1); //base + 1 card
                expect(this.ichigoKun.getPoliticalSkill()).toBe(0); //base unmodified
            });

            it('while participating captures cards from costs', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.keeperInitiate]
                });

                this.player2.pass();
                this.player1.clickCard(this.merchantOfCuriosities);
                this.player1.clickCard(this.ornateFan);
                this.player2.clickPrompt('Yes');
                this.player2.clickCard(this.ambush);

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.player1).toHavePrompt('Choose an event to respond to');
                expect(this.player1).toHavePromptButton('onCardsDiscarded');
                this.player1.clickPrompt('onCardsDiscarded');
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Ornate Fan underneath Ichigo-kun instead of letting them be discarded and place 1 fate on Ichigo-kun - tasty!'
                );

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Ambush underneath Ichigo-kun instead of letting them be discarded - tasty!'
                );

                expect(this.ornateFan.location).toBe(this.ichigoKun.uuid);
                expect(this.ambush.location).toBe(this.ichigoKun.uuid);
                expect(this.ichigoKun.getMilitarySkill()).toBe(3 + 2); //base + 1 card
                expect(this.ichigoKun.getPoliticalSkill()).toBe(0); //base unmodified
            });

            it('while participating captures own cards from opponent effects', function () {
                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.keeperInitiate]
                });

                this.player2.clickCard(this.masterWhisperer);
                this.player2.clickPrompt('player1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Spoils of War and Ornate Fan underneath Ichigo-kun instead of letting them be discarded and place 1 fate on Ichigo-kun - tasty!'
                );
                expect(this.ornateFan.location).toBe(this.ichigoKun.uuid);
                expect(this.ichigoKun.getMilitarySkill()).toBe(3 + 2); //base + 2 cards
                expect(this.ichigoKun.getPoliticalSkill()).toBe(0); //base unmodified
            });

            it('while participating does not capture cards from ring effects', function () {
                this.initiateConflict({
                    ring: 'earth',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.keeperInitiate]
                });

                this.noMoreActions();

                expect(this.player1).toHavePrompt('Any reactions?');
                this.player1.clickPrompt('Pass');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
                expect(this.player1).toHavePrompt('Choose an effect to resolve');
                this.player1.clickPrompt('Draw a card and opponent discards');
                expect(this.player1).not.toHavePrompt('Triggered Abilities');
                expect(this.player1).not.toBeAbleToSelect(this.ichigoKun);
            });

            it('gains fate on first capture of the round', function () {
                expect(this.ichigoKun.fate).toBe(0);

                this.initiateConflict({
                    ring: 'void',
                    type: 'military',
                    attackers: [this.ichigoKun],
                    defenders: [this.keeperInitiate]
                });

                this.player2.pass();
                this.player1.clickCard(this.merchantOfCuriosities);
                this.player1.clickCard(this.ornateFan);
                this.player2.clickPrompt('No');
                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Ornate Fan underneath Ichigo-kun instead of letting them be discarded and place 1 fate on Ichigo-kun - tasty!'
                );
                expect(this.ichigoKun.fate).toBe(1);

                this.player2.clickCard(this.masterWhisperer);
                this.player2.clickPrompt('player1');

                expect(this.player1).toHavePrompt('Triggered Abilities');
                this.player1.clickCard(this.ichigoKun);
                expect(this.getChatLogs(5)).toContain(
                    'player1 uses Ichigo-kun to place Spoils of War and Supernatural Storm underneath Ichigo-kun instead of letting them be discarded - tasty!'
                );
                expect(this.ichigoKun.fate).toBe(1);
            });
        });
    });
});
