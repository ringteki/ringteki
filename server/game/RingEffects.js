const AirRingEffect = require('./Rings/AirRingEffect');
const EarthRingEffect = require('./Rings/EarthRingEffect');
const FireRingEffect = require('./Rings/FireRingEffect');
const VoidRingEffect = require('./Rings/VoidRingEffect');
const WaterRingEffect = require('./Rings/WaterRingEffect');

const ElementToEffect = {
    air: (optional, gameMode) => new AirRingEffect(optional, gameMode),
    earth: (optional, gameMode) => new EarthRingEffect(optional, gameMode),
    fire: (optional, gameMode) => new FireRingEffect(optional, gameMode),
    void: (optional, gameMode) => new VoidRingEffect(optional, gameMode),
    water: (optional, gameMode) => new WaterRingEffect(optional, gameMode)
};

const RingNames = {
    air: 'Air Ring',
    earth: 'Earth Ring',
    fire: 'Fire Ring',
    void: 'Void Ring',
    water: 'Water Ring'
};

class RingEffects {
    static contextFor(player, element, optional = true) {
        let factory = ElementToEffect[element];

        if(!factory) {
            throw new Error(`Unknown ring effect of ${element}`);
        }

        let context = player.game.getFrameworkContext(player);
        context.source = player.game.rings[element];
        context.ability = factory(optional, context.game.gameMode);
        return context;
    }

    static getRingName(element) {
        return RingNames[element];
    }
}

module.exports = RingEffects;
