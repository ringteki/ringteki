const { EffectNames } = require('../../Constants');

class AttackerInfo {
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

class AttackersMatrix {
    constructor(player, characters, game) {
        this.player = player;
        this.characters = characters;
        this.attackers = {};
        this.forcedNumberOfAttackers = 0;
        this.requiredNumberOfAttackers = 0; //For Seven Stings Keep
        this.maximumNumberOfAttackers = 0; //For Seven Stings Keep
        this.defaultAttackers = [];
        this.canPass = true;
        this.game = game;
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
                let matrix = new AttackerInfo(ring, type, availableAttackers, forcedAttackersDueToDeclarationAmountRequirement, forcedAttackersDueToDeclarationRequirement);
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

        let cards = this.characters;
        let availableAttackers = [];
        cards.forEach(card => {
            if(card.canDeclareAsAttacker(conflictType, ring, '', availableAttackers)) {
                availableAttackers.push(card);
            }
        });
        return availableAttackers;
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
            let cards = this.characters;
            let forcedAttackers = [];
            cards.forEach(card => {
                if(card.canDeclareAsAttacker(conflictType, ring, '', forcedAttackers)) {
                    forcedAttackers.push(card);
                }
            });
            if(forcedAttackers.length > 0) {
                this.canPass = false;
            }
            return forcedAttackers;
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

module.exports = AttackersMatrix;
