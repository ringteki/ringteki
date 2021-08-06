// describe('War of Words', function() {
//     integration(function() {
//         describe('Base Case (no dash, no element dependant, no Tadakatsu)', function() {
//             beforeEach(function() {
//                 this.setupTest({
//                     phase: 'draw',
//                     player1: {
//                         inPlay: ['akodo-toturi', 'doji-fumiki', 'maker-of-keepsakes'],
//                         hand: ['war-of-words', 'shori']
//                     },
//                     player2: {
//                         inPlay: ['doji-whisperer', 'doji-challenger'],
//                         provinces: ['khan-s-ordu']
//                     }
//                 });

//                 this.toturi = this.player1.findCardByName('akodo-toturi');
//                 this.fumiki = this.player1.findCardByName('doji-fumiki');
//                 this.keepsakes = this.player1.findCardByName('maker-of-keepsakes');
//                 this.dojiWhisperer = this.player2.findCardByName('doji-whisperer');
//                 this.challenger = this.player2.findCardByName('doji-challenger');
//                 this.war = this.player1.findCardByName('war-of-words');
//                 this.shori = this.player1.findCardByName('shori');

//                 this.shamefulDisplay1 = this.player1.findCardByName('shameful-display', 'province 1');
//                 this.khans = this.player2.findCardByName('khan-s-ordu');
//                 this.shamefulDisplay2 = this.player2.findCardByName('shameful-display', 'province 3');

//                 this.player1.clickPrompt('1');
//                 this.player2.clickPrompt('1');
//                 this.noMoreActions();
//             });

//             it('should trigger at the start of the conflict phase', function() {
//                 expect(this.player1).toHavePrompt('Triggered Abilities');
//                 expect(this.player1).toBeAbleToSelect(this.war);
//                 this.player1.clickCard(this.war);
//                 expect(this.getChatLogs(1)).toContain('player1 plays War of Words to allow each player to declare any conflict as political');
//             });

//             it('should let you declare 2 political conflicts', function() {
//                 this.player1.clickCard(this.war);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'air'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.noMoreActions();
//                 this.player2.passConflict();

//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'earth'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//             });

//             it('should not let you declare 2 military conflicts', function() {
//                 this.player1.clickCard(this.war);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'military',
//                     ring: 'air'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('military')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.noMoreActions();
//                 this.player2.passConflict();

//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'military',
//                     ring: 'earth'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//             });

//             it('should not let you declare 3 conflicts', function() {
//                 this.player1.clickCard(this.war);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'air'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.noMoreActions();
//                 this.player2.passConflict();

//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'earth'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.noMoreActions();
//                 this.player2.passConflict();
//                 this.noMoreActions();
//                 expect(this.player1).toHavePrompt('Which side of the Imperial Favor would you like to claim?');
//             });

//             it('should allow both players to declare extra pol conflicts and let you declare 3 conflicts (gaining an extra mil conflict)', function() {
//                 this.player1.clickCard(this.war);
//                 this.player1.playAttachment(this.shori, this.toturi);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'air'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.challenger.ready();
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.challenger],
//                     defenders: [this.toturi],
//                     province: this.shamefulDisplay,
//                     type: 'political',
//                     ring: 'void'
//                 });
//                 expect(this.player1).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.challenger.ready();
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'earth'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.challenger.ready();
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.challenger],
//                     defenders: [this.toturi],
//                     province: this.shamefulDisplay,
//                     type: 'political',
//                     ring: 'water'
//                 });
//                 expect(this.player1).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.challenger.ready();
//                 this.noMoreActions();
//                 expect(this.player1).not.toHavePrompt('Which side of the Imperial Favor would you like to claim?');
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'fire'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//             });

//             it('should work with Khans Ordu', function() {
//                 this.player1.clickCard(this.war);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     province: this.khans,
//                     type: 'political',
//                     ring: 'air'
//                 });
//                 this.player2.clickCard(this.khans);
//                 this.player2.clickCard(this.challenger);
//                 this.player2.clickPrompt('Done');
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('military')).toBe(true);
//                 this.toturi.bow();
//                 this.noMoreActions();
//                 this.toturi.ready();
//                 this.challenger.ready();
//                 this.noMoreActions();
//                 this.player2.passConflict();

//                 this.noMoreActions();
//                 this.initiateConflict({
//                     attackers: [this.toturi],
//                     defenders: [this.challenger],
//                     province: this.shamefulDisplay2,
//                     type: 'political',
//                     ring: 'earth'
//                 });
//                 expect(this.player2).toHavePrompt('Conflict Action Window');
//                 expect(this.game.isDuringConflict('political')).toBe(true);
//             });
//         });
//     });
// });
