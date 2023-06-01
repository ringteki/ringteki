import type Player from '../player';
import { Byoyomi } from './Byoyomi';
import { ChessClock } from './ChessClock';
import { Clock } from './Clock';
import { Hourglass } from './Hourglass';
import { Timer } from './Timer';

export enum ClockType {
    NONE = 'none',
    TIMER = 'timer',
    CHESS = 'chess',
    HOURGLASS = 'hourglass',
    BYOYOMI = 'byoyomi'
}

type Config = { type: ClockType; time: 0; periods: 0; timePeriod: 0 };

export function clockFor(player: Player, details?: Config) {
    const time = (details?.time ?? 0) * 60;
    const periods = details?.periods ?? 0;
    const timePeriod = details?.timePeriod ?? 0;
    switch (details?.type) {
        case ClockType.NONE:
            return new Clock(player, time, periods);
        case ClockType.TIMER:
            return new Timer(player, time, periods);
        case ClockType.CHESS:
            return new ChessClock(player, time);
        case ClockType.HOURGLASS:
            return new Hourglass(player, time);
        case ClockType.BYOYOMI:
            return new Byoyomi(player, time, periods, timePeriod);
    }
}
