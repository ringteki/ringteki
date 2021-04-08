import { AbilityTypes } from '../../Constants.js';
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BeliefInTheLittleTeacher extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.gainAbility(AbilityTypes.Action, {
                title: 'Discard character\'s status token',
                gameAction: AbilityDsl.actions.discardStatusToken(context => ({
                    target: context.source.personalHonor
                }))
            })
        });
    }
}

BeliefInTheLittleTeacher.id = 'belief-in-the-little-teacher';

module.exports = BeliefInTheLittleTeacher;


