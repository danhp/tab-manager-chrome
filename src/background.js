chrome.commands.onCommand.addListener(function(command) {
    var newIndex;

    switch (command) {
        case 'tab_manager_pin_current':
            chrome.tabs.getSelected(null, function(tab){
                chrome.tabs.update(tab.id, {pinned: !tab.pinned});
            });
            break;

        case "tab_manager_unpin_all":
            chrome.windows.getCurrent({populate: true}, function(window) {
                window.tabs.forEach(function(tab) {
                    chrome.tabs.update(tab.id, {pinned: false});
                });
            });
            break;

        case "tab_manager_move_left":
            chrome.tabs.getSelected(null, function(tab) {
                newIndex = tab.index - 1;
                if (newIndex < 0) return;
                chrome.tabs.move(tab.id, {index: newIndex});
            });
            break;

        case "tab_manager_move_right":
            chrome.tabs.getSelected(null, function(tab) {
                newIndex = tab.index + 1;
                if (newIndex < 0) return;
                chrome.tabs.move(tab.id, {index: newIndex});
            });
            break;

        default:
            break;
    }
});
