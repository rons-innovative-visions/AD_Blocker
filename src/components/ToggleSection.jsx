/* global chrome */

import { Canvas } from "@react-three/fiber";
import Earth from "./models/Earth";
import { Html, PerspectiveCamera } from "@react-three/drei";

const ToggleSection = ({ enabled, setEnabled, toggleAds, refresh, setRefresh, pages, setPages, websites, setWebsites, theme }) => {

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
        <>
            {
                theme ?
                    <EarthToggle {...{ enabled, handleToggle }} />
                    :
                    <BasicToggle {...{ enabled, handleToggle }} />
            }
        </>
    )
}

const BasicToggle = ({ enabled, handleToggle }) => {
    return (
        <div className={`w-10/12 h-10/12 rounded-full grid hover:w-full hover:h-full transition-all ${enabled ? "bg-[#434f5a]" : "bg-[#60B5FF]"}`} onClick={() => handleToggle()}>
            <p className="font-bold text-4xl text-center my-auto">{enabled ? "ON" : "OFF"}</p>
        </div>
    )
}

const EarthToggle = ({ enabled, handleToggle }) => {
    return (
        <Canvas className={`earthCanvas relative cursor-pointer transition-all duration-300 ${enabled ? "opacity-100" : "opacity-80 hover:opacity-100"}`} onClick={() => handleToggle()}>
            <PerspectiveCamera makeDefault position={[0, 0, 2.7]} />
            <ambientLight intensity={1} />
            <directionalLight position={[3, 2, 1]} />

            <Earth enabled={enabled} />

            <Html center>
                <h1 className={`text-3xl font-bold tracking-wider transition-all duration-500 ${enabled ? "text-[#60B5FF]" : "text-white scale-90"}`}>{enabled ? "ON" : "OFF"}</h1>
            </Html>
        </Canvas>
    )
}

export default ToggleSection