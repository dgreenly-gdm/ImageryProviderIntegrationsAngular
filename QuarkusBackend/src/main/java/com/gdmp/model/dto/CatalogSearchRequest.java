package com.gdmp.model.dto;

/**
 * Request DTO for STAC catalog searches.
 * Supports spatial (bbox), temporal (datetime), and collection-based filtering.
 */
public record CatalogSearchRequest(
        /** Bounding box [west, south, east, north] in WGS84 degrees */
        double[] bbox,

        /** ISO 8601 datetime range, e.g. "2024-01-01T00:00:00Z/2024-12-31T23:59:59Z" */
        String datetime,

        /** STAC collection IDs to search within */
        String[] collections,

        /** Maximum number of results to return (default 10) */
        int limit
) {
    public CatalogSearchRequest {
        if (limit <= 0) {
            limit = 10;
        }
    }

    /**
     * Convenience constructor with default limit.
     */
    public CatalogSearchRequest(double[] bbox, String datetime, String[] collections) {
        this(bbox, datetime, collections, 10);
    }
}
