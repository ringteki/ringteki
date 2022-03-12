describe('The Wealth of the Crane', function() {
    integration(function() {
        beforeEach(function() {
            this.setupTest({
                phase: 'conflict',
                player1: {
                    fate: 30,
                    dynastyDiscard: ['doji-whisperer', 'kakita-yoshi', 'kakita-toshimoko', 'daidoji-kageyu', 'moto-chagatai', 'favorable-ground',
                        'imperial-storehouse', 'iron-mine', 'a-season-of-war', 'dispatch-to-nowhere', 'aranat'],
                    provinces: ['manicured-garden', 'endless-plains', 'fertile-fields', 'magistrate-station'],
                    hand: ['bird-bucks', 'bird-bucks']
                }
            });

            this.player1.player.promptedActionWindows.fate = true;
            this.player2.player.promptedActionWindows.fate = true;

            this.player1.reduceDeckToNumber('dynasty deck', 0);

            this.wealth = this.player1.filterCardsByName('bird-bucks')[0];
            this.wealth2 = this.player1.filterCardsByName('bird-bucks')[1];

            this.aranat = this.player1.moveCard('aranat', 'dynasty deck');
            this.yoshi = this.player1.moveCard('kakita-yoshi', 'dynasty deck');
            this.toshimoko = this.player1.moveCard('kakita-toshimoko', 'dynasty deck');
            this.kageyu = this.player1.moveCard('daidoji-kageyu', 'dynasty deck');
            this.chagatai = this.player1.moveCard('moto-chagatai', 'dynasty deck');

            this.favorable = this.player1.moveCard('favorable-ground', 'dynasty deck');
            this.storehouse = this.player1.moveCard('imperial-storehouse', 'dynasty deck');
            this.mine = this.player1.moveCard('iron-mine', 'dynasty deck');
            this.season = this.player1.moveCard('a-season-of-war', 'dynasty deck');
            this.dispatch = this.player1.moveCard('dispatch-to-nowhere', 'dynasty deck');
            this.dojiWhisperer = this.player1.moveCard('doji-whisperer', 'dynasty deck');

            this.p1 = this.player1.findCardByName('manicured-garden');
            this.p2 = this.player1.findCardByName('endless-plains');
            this.p3 = this.player1.findCardByName('fertile-fields');
            this.p4 = this.player1.findCardByName('magistrate-station');
            this.pStronghold = this.player1.findCardByName('shameful-display', 'stronghold province');

        });

        it('should prompt you to choose a non-SH province you control', function() {
            this.player1.clickCard(this.wealth);
            expect(this.player1).toHavePrompt('Choose a province');
            expect(this.player1).toBeAbleToSelect(this.p1);
            expect(this.player1).toBeAbleToSelect(this.p2);
            expect(this.player1).toBeAbleToSelect(this.p3);
            expect(this.player1).toBeAbleToSelect(this.p4);
            expect(this.player1).not.toBeAbleToSelect(this.pStronghold);
        });

        it('should let you choose a non-unique character from the top 8 cards of your deck', function() {
            this.player1.clickCard(this.wealth);
            this.player1.clickCard(this.p1);
            expect(this.player1).toHavePrompt('Choose a character to put in your province');
            expect(this.player1).toHavePromptButton('Doji Whisperer');
            expect(this.player1).not.toHavePromptButton('Kakita Yoshi');
            expect(this.player1).not.toHavePromptButton('Kakita Toshimoko');
            expect(this.player1).not.toHavePromptButton('Daidoji Kageyu');
            expect(this.player1).not.toHavePromptButton('Moto Chagatai');
            expect(this.player1).not.toHavePromptButton('Favorable Ground');
            expect(this.player1).not.toHavePromptButton('Imperial Storehouse');
            expect(this.player1).not.toHavePromptButton('Iron Mine');
            expect(this.player1).not.toHavePromptButton('A Season of War');
            expect(this.player1).not.toHavePromptButton('Dispatch to Nowhere');
            expect(this.player1).not.toHavePromptButton('Aranat');
            expect(this.player1).not.toHavePromptButton('Cancel');
            expect(this.player1).toHavePromptButton('Take nothing');
        });

        it('should put the chosen card in the province faceup (facedown province)', function() {
            this.player1.clickCard(this.wealth);
            this.player1.clickCard(this.p1);
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.getChatLogs(5)).toContain('player1 plays Bird Bucks to put a dynasty character into province 1');
            expect(this.getChatLogs(5)).toContain('player1 takes Doji Whisperer');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');
            expect(this.dojiWhisperer.location).toBe('province 1');
            expect(this.dojiWhisperer.facedown).toBe(false);
        });

        it('should put the chosen card in the province faceup (faceup province)', function() {
            this.p1.facedown = false;
            this.game.checkGameState(true);
            this.player1.clickCard(this.wealth);
            this.player1.clickCard(this.p1);
            this.player1.clickPrompt('Doji Whisperer');
            expect(this.getChatLogs(5)).toContain('player1 plays Bird Bucks to put a dynasty character into Manicured Garden');
            expect(this.getChatLogs(5)).toContain('player1 takes Doji Whisperer');
            expect(this.getChatLogs(5)).toContain('player1 is shuffling their dynasty deck');
            expect(this.dojiWhisperer.location).toBe('province 1');
            expect(this.dojiWhisperer.facedown).toBe(false);
        });
    });
});
