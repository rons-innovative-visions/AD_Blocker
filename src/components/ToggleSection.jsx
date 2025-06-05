/* global chrome */

const ToggleSection = ({ enabled, setEnabled, toggleAds, refresh, setRefresh, pages, setPages, websites, setWebsites }) => {

    const handleToggle = () => {
        const newValue = !enabled

        chrome.storage.local.set({
            adBlockEnabled: newValue
        })

        setEnabled(newValue);

        if (newValue) {
            const newPages = pages.saved.filter((page) => page !== pages.current);
            setPages({ ...pages, enabled: newValue, saved: newPages });
            chrome.storage.local.set({ pages: newPages });

            const newWebsites = websites.saved.filter((website) => website !== websites.current);
            setWebsites({ ...websites, enabled: newValue, saved: newWebsites });
            chrome.storage.local.set({ websites: newWebsites });
        }

        toggleAds(newValue);
        setRefresh(!refresh);
    }

    return (
        <div className={`w-10/12 h-10/12 rounded-full grid hover:w-full hover:h-full transition-all ${enabled ? "bg-[#434f5a]" : "bg-[#60B5FF]"}`} onClick={() => handleToggle()}>
            <p className="font-bold text-4xl text-center my-auto">{enabled ? "ON" : "OFF"}</p>
        </div>
    )
}

export default ToggleSection