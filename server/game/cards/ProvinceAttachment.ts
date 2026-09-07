import { CardType } from '../Constants.js';
import BaseCard from '../BaseCard.js';
import DrawCard from '../DrawCard.js';
import { ProvinceCard } from '../ProvinceCard.js';
import Ring from '../Ring.js';

export class ProvinceAttachment extends DrawCard {
    public setupCardAbilities() {
    }

    public canPlayOn(source: BaseCard | Ring) {
        return (
            source &&
            source.getType() === 'province' &&
            (!this.unbrokenOnly() || !(source instanceof ProvinceCard && source.isBroken)) &&
            (!this.controllerProvinceOnly() || (source as BaseCard).controller === this.controller) &&
            this.getType() === CardType.Attachment
        );
    }

    public canAttach(parent: BaseCard) {
        if(this.unbrokenOnly() && parent instanceof ProvinceCard && parent.isBroken) {
            return false;
        }

        if(this.controllerProvinceOnly() && parent.controller !== this.controller) {
            return false;
        }

        return parent && parent.getType() === CardType.Province && this.getType() === CardType.Attachment;
    }

    protected controllerProvinceOnly(): boolean {
        return false;
    }

    protected unbrokenOnly(): boolean {
        return true;
    }
}
