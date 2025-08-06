import {PlaceDetails} from "./types/PlaceDetails";
import {UniversePlaytime} from "./types/UniversePlaytime";

/*
    Checks if we're on a game (or "experience") page.
 */
const isGameDetailPage = () => {
    return window.location.pathname.startsWith("/games/");
};

/*
    Retrieves the place ID from the url bar.
 */
const getPlaceIdFromUrl = () => {
    const urlParts = window.location.pathname.split('/');

    const gamesIndex = urlParts.indexOf('games');
    if (gamesIndex !== -1 && urlParts.length > gamesIndex + 1) {
        return urlParts[gamesIndex + 1];
    }

    return null;
};

/*
    Gets place details, uses `https://create.roblox.com/docs/cloud/legacy/games/v1#/Games/get_v1_games_multiget_place_details`
 */
const multiFetchPlaceDetails = async (placeIds: string[]): Promise<PlaceDetails[]> => {
    try {
        const response = await fetch(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeIds}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("[Roblox Playtime]: Error fetching playtime data:", error);
        return [];
    }
}

/*
    Injects playtime data into the page.
 */
const injectPlaytime = (weeklyMinutes: number) => {
    const playtimeHours = (weeklyMinutes / 60).toFixed(1);
    const playtimeText = `Playtime: ${playtimeHours} hours this week`;

    // prevent duplicate injection
    if (document.querySelector("#roblox-playtime-display")) {
        console.log("[Roblox Playtime]: Playtime already injected. Skipping.");
        return;
    }

    const maturityContainer = document.querySelector("#game-age-recommendation-container");

    if (!maturityContainer) {
        console.warn("[Roblox Playtime]: Could not find #game-age-recommendation-container.");
        return;
    }

    const playtimeContainer = document.createElement("div");
    playtimeContainer.id = "roblox-playtime-display";
    playtimeContainer.className = maturityContainer.className; // copy styling 👽

    const playtimeLink = document.createElement("a");
    playtimeLink.className = "age-recommendation-title text";
    playtimeLink.textContent = playtimeText;
    playtimeLink.href = "https://www.roblox.com/my/account#!/privacy/Screentime/PerExperienceScreentime";

    playtimeContainer.appendChild(playtimeLink);

    maturityContainer.insertAdjacentElement("afterend", playtimeContainer);

    console.log("[Roblox Playtime]: Playtime injected successfully.");
};

const onDOMContentLoaded = async () => {
    if (!isGameDetailPage()) {
        return;
    }

    try {
        const response = await browser.runtime.sendMessage({type: "requestRobloxPlaytime"});

        const placeId = getPlaceIdFromUrl();
        if (!placeId) {
            console.error("[Roblox Playtime]: No place id found");
            return;
        }

        const placeDetails = (await multiFetchPlaceDetails([placeId]))[0];
        if (!placeDetails) {
            console.error("[Roblox Playtime]: Couldn't fetch place details.");
            return;
        }

        const entry = response.universeWeeklyScreentimes.find((item: UniversePlaytime) => item.universeId === placeDetails.universeId);

        if (entry) {
            injectPlaytime(entry.weeklyMinutes);
        } else {
            console.warn("[Roblox Playtime]: No playtime entry found for this game.");
        }

    } catch (error) {
        console.error("[Roblox Playtime]: Error during content script execution:", error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
} else {
    onDOMContentLoaded();
}

console.log("[Roblox Playtime]: Content script loaded.");