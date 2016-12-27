chrome.commands.onCommand.addListener(function(command) {
    var newIndex;
    var maxTabIndex = 0;

    switch (command) {
        // pinning
        case 'tab_manager_pin_current':
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
                chrome.tabs.update(tab[0].id, {pinned: !tab[0].pinned});
            });
            break;

        case "tab_manager_unpin_all":
            chrome.windows.getCurrent({populate: true}, function(window) {
                window.tabs.forEach(function(tab) {
                    chrome.tabs.update(tab.id, {pinned: false});
                });
            });
            break;

        // moving
        case "tab_manager_move_left":
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
                newIndex = tab[0].index - 1;
                if (newIndex < 0) return;
                chrome.tabs.move(tab[0].id, {index: newIndex});
            });
            break;

        case "tab_manager_move_right":
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
                newIndex = tab[0].index + 1;
                if (newIndex < 0) return;
                chrome.tabs.move(tab[0].id, {index: newIndex});
            });
            break;

        // browsing
        case "tab_manager_browse_left":
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
                newIndex = tab[0].index - 1;
                if (newIndex >= 0) {
                    chrome.tabs.query({index: newIndex, lastFocusedWindow: true}, function(btab) {
                        chrome.tabs.update(btab[0].id, {active: true});
                    });
                } else {
                    // first tab reached
                    chrome.tabs.query({lastFocusedWindow: true}, function (maxTab) {
                        maxTab.forEach(function (t) {
                            // find the maximum tab index (0-based)
                            if (t.index > maxTabIndex) {
                                maxTabIndex = t.index;
                            }
                        });
                        // update the maximum tab index to be active
                        chrome.tabs.query({index: maxTabIndex, lastFocusedWindow: true}, function(tabMax) {
                            chrome.tabs.update(tabMax[0].id, {active: true});
                        });
                        maxTabIndex = 0;
                    });
                }
            });
            break;

        case "tab_manager_browse_right":
            chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tab) {
                newIndex = tab[0].index + 1;
                chrome.tabs.query({index: newIndex, lastFocusedWindow: true}, function(btab) {
                    if (btab.length > 0) {
                       chrome.tabs.update(btab[0].id, {active: true});
                    } else {
                        // last tab reached, go back to first (0-based)
                        chrome.tabs.query({index: 0, lastFocusedWindow: true}, function(tab0) {
                          chrome.tabs.update(tab0[0].id, {active: true});
                        });
                    }
                });
            });
            break;

        default:
            break;
    }
});
