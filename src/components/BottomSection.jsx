/* global chrome */

const BottomSection = ({ pages, setPages, websites, setWebsites, refresh, setRefresh, toggleAds, enabled, setEnabled }) => {
    const handlePagesToggle = () => {
        const newValue = !pages.enabled;
        const newPages = pages.enabled ?
            [...pages.saved, pages.current] :
            pages.saved.filter((page) => page !== pages.current);

        chrome.storage.local.set({ pages: newPages });

        setPages({ ...pages, enabled: newValue, saved: newPages });

        setEnabled(newValue);

        toggleAds(newValue);
        setRefresh(!refresh);
    }

    const handleWebsitesToggle = () => {
        const newValue = !websites.enabled;
        const newWebsites = websites.enabled ?
            [...websites.saved, websites.current] :
            websites.saved.filter((website) => website !== websites.current);

        chrome.storage.local.set({ websites: newWebsites });

        setWebsites({ ...websites, enabled: newValue, saved: newWebsites });

        setEnabled(pages.enabled && newValue);

        toggleAds(newValue);
        setRefresh(!refresh);
    }

    return (
        <div className="w-full h-10/12 grid grid-rows-2 gap-1">
            <div className="w-full h-full flex flex-between rounded-md bg-[#60B5FF]">
                <p className="text-xl my-auto pl-2">Page</p>
                <button type="button" className={`w-4/12 h-full ml-auto rounded-r-[0.35rem] grid focus:outline-none transition-all duration-300 ${pages.enabled ? "bg-[#434f5a] hover:bg-[#60B5FF]" : "bg-[#60B5FF] hover:bg-[#434f5a]"}`} onClick={() => handlePagesToggle()}>
                    <p className="my-auto text-center font-medium cursor-pointer">{pages.enabled ? "ON" : "OFF"}</p>
                </button>
            </div>
            <div className="w-full h-full flex flex-between rounded-md bg-[#434f5a]">
                <p className="text-xl my-auto pl-2">Website</p>
                <button type="button" className={`w-4/12 h-full ml-auto rounded-r-[0.35rem] grid focus:outline-none transition-all duration-300 ${websites.enabled ? "bg-[#60B5FF] hover:bg-[#60B5FF]" : "bg-[#434f5a] hover:bg-[#60B5FF]"}`} onClick={() => handleWebsitesToggle()}>
                    <p className="my-auto text-center font-medium cursor-pointer">{websites.enabled ? "ON" : "OFF"}</p>
                </button>
            </div>
        </div>
    )
}

export default BottomSection