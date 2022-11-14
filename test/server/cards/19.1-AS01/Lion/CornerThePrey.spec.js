// fdescribe('Corner the Prey', function () {
//     integration(function () {
//         describe('Corner the Prey action ability', function () {
//             beforeEach(function () {
//                 this.setupTest({
//                     phase: 'conflict',
//                     player1: {
//                         fate: 500,
//                         inPlay: ['relentless-gloryseeker', 'ikoma-message-runner'],
//                         hand: ['corner-the-prey', 'fine-katana', 'ayubune-pilot']
//                     },
//                     player2: {
//                         inPlay: ['solemn-scholar', 'agasha-prodigy', 'akodo-makoto', 'akodo-kage', 'akodo-cho']
//                     }
//                 });

//                 this.relentlessGloryseeker = this.player1.findCardByName('relentless-gloryseeker');
//                 this.messageRunner = this.player1.findCardByName('ikoma-message-runner');

//                 this.cornerThePrey = this.player1.findCardByName('corner-the-prey');
//                 this.ayubunePilot = this.player1.findCardByName('ayubune-pilot');
//                 this.fineKatana = this.player1.findCardByName('fine-katana');

//                 this.solemnScholar = this.player2.findCardByName('solemn-scholar');
//                 this.agashaProdigy = this.player2.findCardByName('agasha-prodigy');
//                 this.akodoMakoto = this.player2.findCardByName('akodo-makoto');
//                 this.akodoKage = this.player2.findCardByName('akodo-kage');
//                 this.akodoCho = this.player2.findCardByName('akodo-cho');

                
//             });

//             it('should not be playable with no participating follower cards', function () {
//                 this.player1.clickCard(this.fineKatana);
//                 this.player1.clickCard(this.messageRunner);
//                 this.player2.pass();
//                 this.player1.clickCard(this.ayubunePilot);
//                 this.player1.clickCard(this.messageRunner);
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     type: 'military',
//                     attackers: [this.relentlessGloryseeker],
//                     defenders: [this.solemnScholar, this.agashaProdigy, this.akodoMakoto, this.akodoKage, this.akodoCho]
//                 });

//                 this.player2.pass();
//                 this.player1.clickCard(this.cornerThePrey);

//                 expect(this.player1).toHavePrompt('Conflict Action Window');
//             });

//             it('should prompt you to sacrifice followers', function () {
//                 this.noMoreActions();
//                 this.initiateConflict({
//                     type: 'military',
//                     attackers: [this.messageRunner],
//                     defenders: [this.solemnScholar, this.agashaProdigy, this.akodoMakoto, this.akodoKage, this.akodoCho]
//                 });

//                 this.player2.pass();
//                 this.player1.clickCard(this.cornerThePrey);

//                 expect(this.player1).toHavePrompt('Select');
//             });
//         });
//     });
// });
