/*
    Corresponds to `Roblox.Games.Api.Models.Response.PlaceDetails`
 */
export type PlaceDetails = {
    placeId: number,
    name: string,
    description: string,
    sourceName: string | undefined,
    sourceDescription: string | undefined,
    url: string,
    builder: string,
    builderId: number,
    hasVerifiedBadge: boolean,
    isPlayable: boolean,
    reasonProhibited: string,
    universeId: number,
    universeRootPlaceId: number,
    price: number,
    imageToken: string,
    fiatPurchaseData: {
        localizedFiatPrice: string,
        basePriceId: string
    }
}