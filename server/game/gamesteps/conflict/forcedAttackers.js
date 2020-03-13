const { EffectNames } = require('../../Constants');

class ForcedAttackers {
    constructor(ring, conflictType, availableAttackers, forcedAttackers) {
        this.ring = ring;
        this.conflictType = conflictType;
        this.availableAttackers = availableAttackers;
        this.forcedAttackers = forcedAttackers;
    }

    getMinimumAvailableAttackers() {
        return this.forcedAttackers.length;
    }

    getMaximumAvailableAttackers() {
        return this.availableAttackers.length;
    }

    getNumberOfForcedAttackers() {
        return this.forcedAttackers.length;
    }
}

class ForcedAttackersMatrix {
    constructor(player, characters, game) {
        this.player = player;
        this.characters = characters;
        this.attackers = {};
        this.forcedNumberOfAttackers = 0;
        this.requiredNumberOfAttackers = 0; //For Seven Stings Keep
        this.maximumNumberOfAttackers = 0; //For Seven Stings Keep
        this.defaultAttackers = [];
        this.canPass = true;
        this.buildMatrix(game);
    }

    isCombinationValid(ring, conflictType) {
        let enoughAttackers = this.requiredNumberOfAttackers <= this.attackers[ring.name][conflictType].getMaximumAvailableAttackers();
        if(this.forcedNumberOfAttackers === 0) {
            return enoughAttackers;
        }
        return this.attackers[ring.name][conflictType].getNumberOfForcedAttackers() === this.forcedNumberOfAttackers && enoughAttackers;
    }

    buildMatrix(game) {
        const rings = [game.rings.air, game.rings.earth, game.rings.fire, game.rings.void, game.rings.water];
        const conflictTypes = ['military', 'political'];

        this.forcedNumberOfAttackers = 0;
        this.defaultRing = game.rings.air;
        this.defaultType = 'military';
        rings.forEach(ring => {
            this.attackers[ring.name] = {};
            conflictTypes.forEach(type => {
                let forcedAttackers = this.getForcedAttackers(ring, type);
                let availableAttackers = this.getAvailableAttackers(ring, type);
                let matrix = new ForcedAttackers(ring, type, availableAttackers, forcedAttackers);
                this.attackers[ring.name][type] = matrix;
                if (matrix.getMaximumAvailableAttackers() > this.maximumNumberOfAttackers) {
                    this.maximumNumberOfAttackers = matrix.getMaximumAvailableAttackers(); 
                }

                if(matrix.getNumberOfForcedAttackers() > this.forcedNumberOfAttackers) {
                    this.forcedNumberOfAttackers = matrix.getNumberOfForcedAttackers();
                    this.defaultRing = ring;
                    this.defaultType = type;
                }
            });
        });
    }

    getAvailableAttackers(ring, conflictType) {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return [];
        }

        return this.characters.filter(card => card.canDeclareAsAttacker(conflictType, ring));
    }

    getForcedAttackers(ring, conflictType) {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return [];
        }

        if(this.player.getEffects(EffectNames.MustDeclareMaximumAttackers).some(effect => effect === 'both' || effect === conflictType)) {
            let forced = this.characters.filter(card => card.canDeclareAsAttacker(conflictType, ring));
            if(forced.length > 0) {
                this.canPass = false;
            }
            return forced;
        }

        return this.characters.filter(card =>
            card.canDeclareAsAttacker(conflictType, ring) &&
            card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some(effect => effect === 'both' || effect === conflictType));
    }
}

module.exports = ForcedAttackersMatrix;
