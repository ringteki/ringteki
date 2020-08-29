const defaultWindows = {
    dynasty: true,
    draw: false,
    preConflict: true,
    conflict: true,
    fate: false,
    regroup: false
};

const defaultKeywordSettings = {
    markCardsUnselectable: true,
    cancelOwnAbilities: false,
    orderForcedAbilities: false,
    confirmOneClick: false,
    disableCardStats: false,
    showStatusInSidebar: false,
    sortHandByName: false
};

const defaultSettings = {
    disableGravatar: false,
    windowTimer: 10,
    background: 'BG1',
    cardSize: 'normal'
};

const defaultTimerSettings = {
    events: true,
    eventsInDeck: false
};

function getUserWithDefaultsSet(user) {
    let userToReturn = user;

    if(!userToReturn) {
        return userToReturn;
    }

    userToReturn.settings = Object.assign({}, defaultSettings, userToReturn.settings);
    userToReturn.settings.keywordSettings = Object.assign({}, defaultKeywordSettings, userToReturn.settings.keywordSettings);
    userToReturn.settings.timerSettings = Object.assign({}, defaultTimerSettings, userToReturn.settings.timerSettings);
    userToReturn.permissions = Object.assign({}, userToReturn.permissions);
    userToReturn.promptedActionWindows = Object.assign({}, defaultWindows, userToReturn.promptedActionWindows);
    if(!userToReturn.blockList) {
        userToReturn.blockList = [];
    }

    return userToReturn;
}

module.exports = {
    getUserWithDefaultsSet: getUserWithDefaultsSet
};
