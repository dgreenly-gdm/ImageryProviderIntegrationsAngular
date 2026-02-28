package com.gdmp.stac;

import com.gdmp.model.dto.CatalogSearchRequest;
import com.gdmp.model.dto.CatalogSearchResponse;

import java.util.List;

/**
 * Interface for STAC (SpatioTemporal Asset Catalog) provider integrations.
 * Each implementation connects to a specific STAC-compliant catalog API
 * (e.g., Copernicus Data Space, USGS, Planet).
 */
public interface StacProvider {

    /**
     * Returns the human-readable name of this STAC provider.
     *
     * @return provider name, e.g. "Copernicus Data Space"
     */
    String getProviderName();

    /**
     * Searches the provider's STAC catalog using the given parameters.
     *
     * @param params search parameters including bbox, datetime, collections, and limit
     * @return response containing matched STAC items and result counts
     */
    CatalogSearchResponse search(CatalogSearchRequest params);

    /**
     * Returns the list of available STAC collection IDs from this provider.
     *
     * @return list of collection identifiers
     */
    List<String> getCollections();
}
