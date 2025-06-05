/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
    chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: ["ruleset_1"]
    });

    chrome.storage.local.set({
        adBlockEnabled: true,
        theme: false,
        pages: [],
        websites: [],
    })
})

const isValidUrl = (url) => {
    return /^https?:\/\//.test(url);
}

const updateAdBlocking = (url) => {
    chrome.storage.local.get(["adBlockEnabled", "pages", "websites"], ({ adBlockEnabled, pages, websites }) => {
        const enabled = adBlockEnabled;
        const domain = new URL(url).hostname;

        const shouldDisable = pages.includes(url) || websites.includes(domain)

        chrome.declarativeNetRequest.updateEnabledRulesets({
            enableRulesetIds: enabled && !shouldDisable ? ["ruleset_1"] : [],
            disableRulesetIds: !enabled || shouldDisable ? ["ruleset_1"] : [],
        })
    })
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url && isValidUrl(tab.url)) {
        updateAdBlocking(tab.url);
    }
})

chrome.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {
    if (frameId === 0 && isValidUrl(url)) {
        chrome.tabs.get(tabId, (tab) => {
            if (tab?.url && isValidUrl(tab.url)) updateAdBlocking(tab.url);
        })
    }
})