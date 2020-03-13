const { EffectNames } = require('../../Constants');

class ForcedAttackers {
    constructor(ring, conflictType, availableAttackers, forcedAttackersDueToDeclarationAmountRequirement, forcedAttackersDueToDeclarationRequirement) {
        this.ring = ring;
        this.conflictType = conflictType;
        this.availableAttackers = availableAttackers;
        this.forcedAttackersDueToDeclarationAmountRequirement = forcedAttackersDueToDeclarationAmountRequirement;
        this.forcedAttackersDueToDeclarationRequirement = forcedAttackersDueToDeclarationRequirement;
    }

    getMaximumAvailableAttackers() {
        return this.availableAttackers.length;
    }

    getNumberOfForcedAttackers() {
        return this.forcedAttackersDueToDeclarationAmountRequirement.length;
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
        if(this.requiredNumberOfAttackers > 0) {
            return enoughAttackers;
        } else if(this.forcedNumberOfAttackers === 0) {
            return true;
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
                let forcedAttackersDueToDeclarationAmountRequirement = this.getForcedAttackersByDeclarationAmountRequirement(ring, type);
                let forcedAttackersDueToDeclarationRequirement = this.getForcedAttackersByDeclarationRequirement(ring, type);
                let availableAttackers = this.getAvailableAttackers(ring, type);
                let matrix = new ForcedAttackers(ring, type, availableAttackers, forcedAttackersDueToDeclarationAmountRequirement, forcedAttackersDueToDeclarationRequirement);
                this.attackers[ring.name][type] = matrix;
                if(matrix.getMaximumAvailableAttackers() > this.maximumNumberOfAttackers) {
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
        if(this.requiredNumberOfAttackers <= 0) {
            return this.getForcedAttackersByDeclarationAmountRequirement(ring, conflictType);
        }
        return this.getForcedAttackersByDeclarationRequirement(ring, conflictType);
    }

    //Internal use only
    getForcedAttackersByDeclarationAmountRequirement(ring, conflictType) {
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

    //Internal use only
    getForcedAttackersByDeclarationRequirement(ring, conflictType) {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return [];
        }
        return this.characters.filter(card =>
            card.canDeclareAsAttacker(conflictType, ring) &&
            card.getEffects(EffectNames.MustBeDeclaredAsAttacker).some(effect => effect === 'both' || effect === conflictType));
    }
}

module.exports = ForcedAttackersMatrix;
