const { EffectNames } = require('../../Constants');

class ForcedAttackers {
    constructor(ring, conflictType, attackers) {
        this.ring = ring;
        this.conflictType = conflictType;
        this.attackers = attackers;
    }

    getNumberOfAttackers() {
        return this.attackers.length;
    }
}

class ForcedAttackersMatrix {
    constructor(player, characters, game) {
        this.player = player;
        this.characters = characters;
        this.attackers = {};
        this.maximumAttackers = 0;
        this.defaultAttackers = [];
        this.canPass = true;
        this.buildMatrix(game);
    }

    isCombinationValid(ring, conflictType) {
        if(this.maximumAttackers === 0) {
            return true;
        }
        return this.attackers[ring.name][conflictType].getNumberOfAttackers() === this.maximumAttackers;
    }

    buildMatrix(game) {
        const rings = [game.rings.air, game.rings.earth, game.rings.fire, game.rings.void, game.rings.water];
        const conflictTypes = ['military', 'political'];

        this.maximumAttackers = 0;
        this.defaultRing = game.rings.air;
        this.defaultType = 'military';
        rings.forEach(ring => {
            this.attackers[ring.name] = {};
            conflictTypes.forEach(type => {
                let attackers = this.getForcedAttackers(ring, type);
                this.attackers[ring.name][type] = new ForcedAttackers(ring, type, attackers);
                if(attackers.length > this.maximumAttackers) {
                    this.maximumAttackers = attackers.length;
                    this.defaultRing = ring;
                    this.defaultType = type;
                }
            });
        });
    }

    getForcedAttackers(ring, conflictType) {
        if(!this.player.hasLegalConflictDeclaration({ type: conflictType, ring: ring })) {
            return 0;
        }

        if(this.player.getEffects(EffectNames.MustDeclareMaximumAttackers).some(effect => effect === 'both' || effect === conflictType)) {
            let forced = this.characters.filter(card => card.canDeclareAsAttacker(conflictType, ring));
            if (forced.length > 0) {
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
