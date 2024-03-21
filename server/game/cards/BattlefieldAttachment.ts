import type BaseCard from "../basecard";
import { CardTypes } from "../Constants";
import DrawCard from "../drawcard";
import { ProvinceCard } from "../ProvinceCard";

export class BattlefieldAttachment extends DrawCard {
    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { battlefield: 1 }
        });
    }

    public canPlayOn(source: any) {
        return (
            source &&
            source.getType() === 'province' &&
            (!this.unbrokenOnly() || !source.isBroken) &&
            this.getType() === CardTypes.Attachment
        );
    }

    public canAttach(parent: BaseCard) {
        return (
            parent instanceof ProvinceCard &&
            this.getType() === CardTypes.Attachment &&
            (!this.unbrokenOnly() || !parent.isBroken)
        );
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
