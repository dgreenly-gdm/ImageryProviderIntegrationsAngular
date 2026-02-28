package com.gdmp.model.dto;

import com.gdmp.stac.StacItem;

import java.util.List;

/**
 * Response DTO wrapping STAC search results with match counts.
 */
public record CatalogSearchResponse(
        /** The list of STAC items matching the search criteria */
        List<StacItem> features,

        /** Total number of items matching the query (may exceed numberReturned) */
        int numberMatched,

        /** Number of items actually returned in this response */
        int numberReturned
) {
    /**
     * Factory method to create a response from a list of items and a total match count.
     */
    public static CatalogSearchResponse of(List<StacItem> features, int numberMatched) {
        return new CatalogSearchResponse(features, numberMatched, features.size());
    }
}
