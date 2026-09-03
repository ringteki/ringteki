import { ConflictType, EffectName } from './Constants.js';
import { GameModes } from '../GameModes.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type DrawCard from './DrawCard.js';
import type Ring from './Ring.js';
import type { ProvinceCard } from './ProvinceCard.js';

export interface ConflictDeclarationProperties {
    type?: ConflictType | ConflictType[];
    ring?: Ring | Ring[];
    attacker?: DrawCard;
    province?: ProvinceCard | ProvinceCard[] | null;
    forcedDeclaredType?: ConflictType;
}

export class PlayerConflictManager {
    declaredConflictOpportunities: Record<string, number> = {
        military: 0,
        political: 0,
        passed: 0,
        forced: 0
    };

    defaultAllowedConflicts: Record<string, number> = {
        military: 1,
        political: 1
    };

    constructor(private readonly player: Player, private readonly game: Game) { }

    hasLegalConflictDeclaration(properties: ConflictDeclarationProperties): boolean {
        const conflictType = this.getLegalConflictTypes(properties);
        if(conflictType.length === 0) {
            return false;
        }
        let conflictRing = properties.ring || Object.values(this.game.rings);
        conflictRing = Array.isArray(conflictRing) ? conflictRing : [conflictRing];
        conflictRing = conflictRing.filter((ring: Ring) => ring.canDeclare(this.player));
        if(conflictRing.length === 0) {
            return false;
        }
        const cards = properties.attacker ? [properties.attacker] : this.player.cardsInPlay.slice();
        if(!this.player.opponent) {
            return conflictType.some((type: string) =>
                conflictRing.some((ring: Ring) => cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring)))
            );
        }
        let conflictProvince = properties.province || (this.player.opponent && this.player.opponent.getProvinces());
        conflictProvince = Array.isArray(conflictProvince) ? conflictProvince : [conflictProvince];
        return conflictType.some((type: string) =>
            conflictRing.some((ring: Ring) =>
                conflictProvince.some(
                    (province: ProvinceCard) =>
                        province.canDeclare(type, ring) &&
                        cards.some((card: DrawCard) => card.canDeclareAsAttacker(type, ring, province, this.game.currentConflict?.attackers))
                )
            )
        );
    }

    getConflictOpportunities(): number {
        const setConflictDeclarationType = this.player.mostRecentEffect(EffectName.SetConflictDeclarationType);
        const forceConflictDeclarationType = this.player.mostRecentEffect(EffectName.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.player.mostRecentEffect(EffectName.ProvideConflictDeclarationType);
        const maxConflicts = this.player.mostRecentEffect(EffectName.SetMaxConflicts);
        const skirmishModeRRGLimit = this.game.gameMode === GameModes.Skirmish ? 1 : 0;
        if(maxConflicts) {
            return this.getConflictsWhenMaxIsSet(maxConflicts);
        }

        if(provideConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(provideConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        if(forceConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(forceConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        if(setConflictDeclarationType) {
            return (
                this.getRemainingConflictOpportunitiesForType(setConflictDeclarationType) -
                this.declaredConflictOpportunities[ConflictType.Passed] -
                this.declaredConflictOpportunities[ConflictType.Forced]
            );
        }

        return (
            this.getRemainingConflictOpportunitiesForType(ConflictType.Military) +
            this.getRemainingConflictOpportunitiesForType(ConflictType.Political) -
            this.declaredConflictOpportunities[ConflictType.Passed] -
            this.declaredConflictOpportunities[ConflictType.Forced] -
            skirmishModeRRGLimit
        );
    }

    getRemainingConflictOpportunitiesForType(type: string): number {
        return Math.max(0, this.getMaxConflictOpportunitiesForPlayerByType(type) - this.declaredConflictOpportunities[type]);
    }

    getLegalConflictTypes(properties: ConflictDeclarationProperties): string[] {
        let types = properties.type || [ConflictType.Military, ConflictType.Political];
        types = Array.isArray(types) ? types : [types];
        const forcedDeclaredType =
            properties.forcedDeclaredType ||
            (this.game.currentConflict && this.game.currentConflict.forcedDeclaredType);
        if(forcedDeclaredType) {
            return [forcedDeclaredType].filter(
                (type) =>
                    types.includes(type) &&
                    this.getConflictOpportunities() > 0 &&
                    !this.player.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
            );
        }

        if(this.getConflictOpportunities() === 0) {
            return [];
        }

        return types.filter(
            (type) =>
                this.getRemainingConflictOpportunitiesForType(type) > 0 &&
                !this.player.getEffects(EffectName.CannotDeclareConflictsOfType).includes(type)
        );
    }

    getConflictsWhenMaxIsSet(maxConflicts: number): number {
        return Math.max(0, maxConflicts - this.game.getConflicts(this.player).length);
    }

    getMaxConflictOpportunitiesForPlayerByType(type: string): number {
        let setConflictType: ConflictType | undefined = this.player.mostRecentEffect(EffectName.SetConflictDeclarationType);
        let forceConflictType: ConflictType | undefined = this.player.mostRecentEffect(EffectName.ForceConflictDeclarationType);
        const provideConflictDeclarationType = this.player.mostRecentEffect(EffectName.ProvideConflictDeclarationType);
        const additionalConflictEffects = this.player.getEffects(EffectName.AdditionalConflict);
        const additionalConflictsForType = additionalConflictEffects.filter((x: string) => x === type).length;
        let baselineAvailableConflicts =
            this.defaultAllowedConflicts[ConflictType.Military] +
            this.defaultAllowedConflicts[ConflictType.Political];
        if(provideConflictDeclarationType && setConflictType !== provideConflictDeclarationType) {
            setConflictType = undefined;
        }
        if(provideConflictDeclarationType && forceConflictType !== provideConflictDeclarationType) {
            forceConflictType = undefined;
        }

        if(this.game.gameMode === GameModes.Skirmish) {
            baselineAvailableConflicts = 1;
        }

        if(setConflictType && type === setConflictType) {
            let declaredConflictsOfOtherType = 0;
            if(setConflictType === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(setConflictType && type !== setConflictType) {
            return 0;
        }
        if(forceConflictType && type === forceConflictType) {
            let declaredConflictsOfOtherType = 0;
            if(forceConflictType === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            return baselineAvailableConflicts + additionalConflictEffects.length - declaredConflictsOfOtherType;
        } else if(forceConflictType && type !== forceConflictType) {
            return 0;
        }
        if(provideConflictDeclarationType) {
            let declaredConflictsOfOtherType = 0;
            if(type === ConflictType.Military) {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Political];
            } else {
                declaredConflictsOfOtherType = this.declaredConflictOpportunities[ConflictType.Military];
            }
            const availableAll =
                baselineAvailableConflicts +
                this.player.getEffects(EffectName.AdditionalConflict).length -
                declaredConflictsOfOtherType;
            if(type === provideConflictDeclarationType) {
                return availableAll;
            }
            const maxType = this.defaultAllowedConflicts[type] + additionalConflictsForType;
            const declaredType = this.declaredConflictOpportunities[type];
            return Math.min(maxType - declaredType, availableAll);
        }
        return this.defaultAllowedConflicts[type] + additionalConflictsForType;
    }

    resetConflictOpportunities(): void {
        this.declaredConflictOpportunities[ConflictType.Military] = 0;
        this.declaredConflictOpportunities[ConflictType.Political] = 0;
        this.declaredConflictOpportunities[ConflictType.Passed] = 0;
        this.declaredConflictOpportunities[ConflictType.Forced] = 0;
    }
}
