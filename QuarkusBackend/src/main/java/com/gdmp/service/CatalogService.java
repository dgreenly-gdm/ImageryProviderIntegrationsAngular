package com.gdmp.service;

import com.gdmp.model.dto.CatalogSearchRequest;
import com.gdmp.model.dto.CatalogSearchResponse;
import com.gdmp.stac.CopernicusStacProvider;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.jboss.logging.Logger;

import java.util.List;

/**
 * Service layer for STAC catalog operations.
 * Delegates to configured StacProvider implementations for search and discovery.
 * Currently routes all requests to the Copernicus Data Space STAC provider.
 */
@ApplicationScoped
public class CatalogService {

    private static final Logger LOG = Logger.getLogger(CatalogService.class);

    @Inject
    CopernicusStacProvider copernicusProvider;

    /**
     * Searches the STAC catalog using the given parameters.
     * Delegates to the Copernicus STAC provider.
     *
     * @param request search parameters including bbox, datetime, collections, and limit
     * @return search results with matched STAC items
     */
    public CatalogSearchResponse search(CatalogSearchRequest request) {
        LOG.infof("Catalog search request: bbox=%s, datetime=%s, collections=%s, limit=%d",
                request.bbox() != null ? formatBbox(request.bbox()) : "null",
                request.datetime(),
                request.collections() != null ? String.join(", ", request.collections()) : "null",
                request.limit());

        return copernicusProvider.search(request);
    }

    /**
     * Returns the list of available STAC collections from all configured providers.
     *
     * @return list of collection IDs
     */
    public List<String> getCollections() {
        LOG.info("Fetching available STAC collections");
        return copernicusProvider.getCollections();
    }

    private String formatBbox(double[] bbox) {
        if (bbox.length != 4) return "invalid";
        return String.format("[%.4f, %.4f, %.4f, %.4f]", bbox[0], bbox[1], bbox[2], bbox[3]);
    }
}
