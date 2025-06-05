/* global chrome */
import { useEffect, useState } from 'react'
import { ToggleSection, BottomSection } from './components'

function App() {
  const [enabled, setEnabled] = useState(true)

  const [refresh, setRefresh] = useState(false)
  const [theme, setTheme] = useState(false)

  const [pages, setPages] = useState({ enabled: true, current: null, saved: [] });
  const [websites, setWebsites] = useState({ enabled: true, current: null, saved: [] });

  useEffect(() => {
    getSavedData();
  }, [])

  const getSavedData = () => {
    chrome.storage.local.get(["adBlockEnabled", "theme", "pages", "websites"], ({ adBlockEnabled, theme, pages: savedPages, websites: savedWebsites }) => {
      setTheme(theme);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const domain = new URL(url).hostname;

        const pagesEnabled = savedPages?.includes(url);
        const websitesEnabled = savedWebsites?.includes(domain)

        setEnabled(!pagesEnabled && !websitesEnabled && adBlockEnabled);
        setPages({ current: url, enabled: !pagesEnabled, saved: savedPages });
        setWebsites({ current: domain, enabled: !websitesEnabled, saved: savedWebsites });
      })
    })
  }

  const toggleAds = (value) => {
    chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: value ? ["ruleset_1"] : [],
      disableRulesetIds: !value ? ["ruleset_1"] : [],
    });
  }

  const toggleTheme = () => {
    setTheme(!theme);
    chrome.storage.local.set({ theme: !theme });
  }

  const toggleRefresh = () => {
    setRefresh(!refresh);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.reload(tabs[0].id);
    })
  }

  return (
    <div className="w-full h-full pt-1 select-none">
      <div>
        <img className="w-6 h-6 absolute top-3 left-4 cursor-pointer hover:scale-105 transition-all duration-400" src={`/${theme ? "brush-fill" : "brush"}.svg`} alt="brush" onClick={() => toggleTheme()} />
        <h1 className="text-2xl text-[#60B5FF] font-medium text-center">Ad Blocker</h1>
        <img className={`w-7 h-7 absolute right-4 top-2 cursor-pointer hover:scale-105 transition-all duration-400 ${refresh ? "translate-x-0}" : "translate-x-20"}`} src="/reload.svg" alt="brush" onClick={() => toggleRefresh()} />
      </div>
      <div className="w-full grid items-center justify-center h-10/12">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center cursor-pointer ${enabled ? "bg-[#60B5FF]" : ""}`}>
          <ToggleSection {...{ enabled, setEnabled, toggleAds, refresh, setRefresh, pages, setPages, websites, setWebsites }} />
        </div>
        <BottomSection {...{ pages, setPages, websites, setWebsites, refresh, setRefresh, toggleAds, enabled, setEnabled }} />
      </div>
    </div>
  )
}

export default App
