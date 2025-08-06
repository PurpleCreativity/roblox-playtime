import type {UniversePlaytime} from "./types/UniversePlaytime";

/*
    Retrieves the .ROBLOSECURITY cookie, used for authentiacted requests to the roblox API.
 */
const getRobloxCookie = async (): Promise<string | null> => {
    try {
        const cookie = await browser.cookies.get({
            url: "https://www.roblox.com",
            name: ".ROBLOSECURITY"
        });

        return cookie ? cookie.value : null;
    } catch (error) {
        console.error("[Roblox Playtime]: Error getting .ROBLOSECURITY cookie:", error);
        return null;
    }
}

const apiUrl = "https://apis.roblox.com/parental-controls-api/v1/parental-controls/get-top-weekly-screentime-by-universe";

/*
    Uses the parental controls api V1 to retrieve experience screentime.
 */
const fetchPlaytimeData = async (): Promise<UniversePlaytime[]> => {
    const robloxCookie = await getRobloxCookie();
    if (!robloxCookie) {
        console.warn("[Roblox Playtime]: .ROBLOSECURITY cookie not found. Cannot fetch playtime data.");
        return [];
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Cookie': `.ROBLOSECURITY=${robloxCookie}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        console.log("[Roblox Playtime]: Successfully fetched playtime data:", data);

        return data;
    } catch (error) {
        console.error("[Roblox Playtime]: Error fetching playtime data:", error);
        return [];
    }
}

browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "requestRobloxPlaytime") {
        return await fetchPlaytimeData();
    }
});

console.log("[Roblox Playtime]: Background script loaded.");