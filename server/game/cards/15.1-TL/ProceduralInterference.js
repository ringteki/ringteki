const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Locations, CardTypes, TargetModes } = require('../../Constants');

class ProceduralInterference extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard all cards in a province or gain 2 honor',
            targets: {
                province:{
                    location: Locations.Provinces,
                    controller: Players.Opponent,
                    cardType: CardTypes.Province
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'province',
                    player: Players.Opponent,
                    choices: {
                        'discard each card in the province': AbilityDsl.actions.moveCard(context => ({
                            destination: Locations.DynastyDiscardPile,
                            target: context.targets.province.controller.getDynastyCardsInProvince(context.targets.province.location)
                        })),
                        'let opponent gain 2 honor': AbilityDsl.actions.gainHonor({
                            amount: 2
                        })
                    }
                }
            },
            effect:'{1}{2}',
            effectArgs: context => {
                if(context.selects.select.choice === 'let opponent gain 2 honor') {
                    return ['take 2 honor from ', context.player.opponent];
                }
                return ['discard each card in the province ', context.targets.province];
            }
        });
    }
}

ProceduralInterference.id = 'procedural-interference';

module.exports = ProceduralInterference;
